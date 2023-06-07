import { Column, Entity, Index } from 'typeorm'
import { DBTypes, Language } from 'lib/types'

@Entity({ name: 'teacher' })
export class TeacherEntity {
    @Index()
    @Column({ unique: true })
    teacherUUID: string

    @Index()
    @Column({
        type: DBTypes.Enum,
        enum: Language
    })
    language: Language

    @Index()
    @Column()
    imageKey: string
}
