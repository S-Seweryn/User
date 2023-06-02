import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { TeacherEntity, UserEntity } from 'lib/entities'
import { ImageService } from 'modules/image'
import { Teacher } from './types'
import { GetTeacherDao } from './dao'

@Injectable()
export class TeacherService {
    constructor(@InjectRepository(TeacherEntity) private teacherRepository: Repository<TeacherEntity>, private readonly imageService: ImageService) {}

    async addTeacher(teacher: Teacher, manager: EntityManager) {
        const { imageBase64, ...teacherToSave } = teacher
        const imageKey = await this.imageService.uploadImage(imageBase64)

        return manager.getRepository(TeacherEntity).save({
            ...teacherToSave,
            imageKey
        })
    }

    getTeacher(teacherUUID: string) {
        return this.teacherRepository
            .createQueryBuilder('T')
            .select('T.teacherUUID, U.firstName, U.lastName, T.language, T.description, T.imageKey')
            .innerJoin(UserEntity, 'U', 'U.userUUID = T.teacherUUID')
            .where('T.teacherUUID = :teacherUUID', { teacherUUID })
            .getRawOne<GetTeacherDao>()
    }

    getTeachers(teachersUUID: Array<string>) {
        return this.teacherRepository
            .createQueryBuilder('T')
            .select('T.teacherUUID, U.firstName, U.lastName, T.language, T.description, T.imageKey')
            .innerJoin(UserEntity, 'U', 'U.userUUID = T.teacherUUID')
            .where('T.teacherUUID IN (:...teachersUUID)', { teachersUUID })
            .getRawMany<GetTeacherDao>()
    }
}
