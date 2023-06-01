import { Language, NewUser } from 'lib/types'

export type Teacher = {
    teacherUUID: string
    language: Language
    description: string
    imageBase64: string
}
