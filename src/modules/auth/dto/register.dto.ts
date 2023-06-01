import { IsEmail, IsString } from 'class-validator'
import { IsValidPassword } from 'lib/validators'

export class RegisterDto {
    @IsString()
    readonly firstName: string

    @IsString()
    readonly lastName: string

    @IsEmail()
    readonly email: string

    @IsValidPassword()
    readonly password: string
}
