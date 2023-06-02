import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { UserEntity } from 'lib/entities'
import { NewUser } from 'lib/types'
import { hashPassword, R } from 'lib/utils'
import { Role } from 'lib/common'
import { GetUserEmailInfoDao } from './dao'

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

    getUser(userUUID: string, userRole?: Role) {
        return this.userRepository.findOne({ where: { userUUID, userRole } })
    }

    addUser(User: NewUser, manager?: EntityManager) {
        const { password, ...UserToSave } = User
        const repository = manager ? manager.getRepository(UserEntity) : this.userRepository

        return repository.save({
            ...UserToSave,
            password: hashPassword(password)
        })
    }

    checkEmail(email: string, userRoleUUID: string) {
        return this.userRepository
            .findOne({
                select: ['userUUID'],
                where: {
                    email,
                    userRoleUUID
                }
            })
            .then(Boolean)
    }

    getUserByEmail(email: string, password: string, role: Role) {
        return this.userRepository.findOne({
            select: ['userUUID'],
            where: {
                email,
                password: hashPassword(password)
            }
        })
    }

    getLoggedUser(userUUID: string) {
        return this.userRepository
            .findOneOrFail({
                select: ['userUUID'],
                where: {
                    userUUID
                }
            })
            .then(({ userUUID }) => ({
                userUUID
            }))
    }

    confirmUser(userUUID: string) {
        return this.userRepository
            .update(
                {
                    userUUID
                },
                {
                    isActive: true
                }
            )
            .then(row => Boolean(row.affected))
            .catch(R.always(false))
    }

    getUsersEmailInfo(usersUUID: Array<string>) {
        return this.userRepository
            .createQueryBuilder('U')
            .select('U.userUUID, U.firstName, U.lastName, U.email')
            .where('U.userUUID IN (:...usersUUID)', { usersUUID })
            .getRawMany<GetUserEmailInfoDao>()
    }
}
