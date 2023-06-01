import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { DBTypes } from 'lib/types'
import { Role } from 'lib/common'
import { UserEntity } from './user.entity'

@Entity({ name: 'userRole' })
export class UserRoleEntity {
    @PrimaryGeneratedColumn('uuid')
    userRoleUUID: string

    @Column({
        type: DBTypes.Enum,
        enum: Role
    })
    role: Role

    @CreateDateColumn({ select: false })
    createdAt: Date

    @UpdateDateColumn({ select: false })
    updatedAt: Date

    @OneToMany(() => UserEntity, user => user.userRole)
    users: Array<UserEntity>
}
