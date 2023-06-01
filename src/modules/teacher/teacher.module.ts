import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TeacherEntity } from 'lib/entities'
import { ImageModule } from 'modules/image'
import { TeacherService } from './teacher.service'

@Module({
    imports: [ImageModule, TypeOrmModule.forFeature([TeacherEntity])],
    providers: [TeacherService],
    exports: [TeacherService]
})
export class TeacherModule {}
