import { Column, Entity, Index, PrimaryColumn } from 'typeorm'
import { DBTypes, Language } from 'lib/types'

@Entity({ name: 'teacher' })
export class TeacherEntity {
    @PrimaryColumn()
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
