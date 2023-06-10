import { Column, Entity, Index } from 'typeorm'
import { DBTypes, Language } from 'lib/types'

@Entity({ name: 'teacher' })
export class TeacherEntity {
    @Column({ unique: true })
    teacherUUID: string

    @Index()
    @Column({
        type: DBTypes.Enum,
        enum: Language
    })
    language: Language

    @Column({ unique: true })
    imageKey: string
}
