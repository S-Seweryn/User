import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'
import { UserRefreshTokenEntity } from './user-refresh-token.entity'
import { UserRoleEntity } from './user-role.entity'

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    userUUID: string

    @Index()
    @Column()
    firstName: string

    @Index()
    @Column()
    lastName: string

    @Column({ unique: true })
    email: string

    @Index()
    @Column({ select: false })
    password: string

    @Column({
        type: Boolean,
        default: false
    })
    isActive: boolean

    @Column()
    userRoleUUID: string

    @CreateDateColumn({ select: false })
    createdAt: Date

    @UpdateDateColumn({ select: false })
    updatedAt: Date

    @OneToMany(() => UserRefreshTokenEntity, refreshToken => refreshToken.user)
    refreshToken: Array<UserRefreshTokenEntity>

    @ManyToOne(() => UserRoleEntity, userRole => userRole.users)
    @JoinColumn({ name: 'userRoleUUID' })
    userRole: UserRoleEntity
}
