import { IsEnum, IsString } from 'class-validator'
import { Language } from 'lib/types'
import { RegisterDto } from './register.dto'

export class TeacherRegisterDto extends RegisterDto {
    @IsEnum(Language)
    readonly language: Language

    @IsString()
    readonly description: string

    @IsString()
    readonly imageBase64: string
}
