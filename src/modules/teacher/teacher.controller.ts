import { Controller, Post } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { UserMicroserviceCommand } from 'lib/common'
import { ImageService } from 'modules/image'
import { TeacherService } from './teacher.service'
import { TEACHER } from './constants'

@Controller(TEACHER)
export class TeacherController {
    constructor(private readonly teacherService: TeacherService, private readonly imageService: ImageService) {}

    @MessagePattern({ cmd: UserMicroserviceCommand.GetTeachers })
    async getTeachers(@Payload() teachersUUID: Array<string>) {
        const teachers = await this.teacherService.getTeacher(teachersUUID)

        return teachers.map(teacher => this.imageService.prepareImage(teacher))
    }
}
