import { IsEnum, IsInt, IsPositive, IsUUID } from 'class-validator'
import { Role } from 'lib/common'

export class GetUserDto {
    @IsUUID(4)
    readonly userUUID: string

    @IsEnum(Role)
    readonly role: Role
}
