import { IsEmail, IsEnum } from 'class-validator'
import { IsValidPassword } from 'lib/validators'

export class MailLoginDto {
    @IsEmail()
    readonly email: string

    @IsValidPassword()
    readonly password: string
}
