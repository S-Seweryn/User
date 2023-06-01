import { IsJWT } from 'class-validator'

export class RegistrationConfirmDto {
    @IsJWT()
    readonly token: string
}
