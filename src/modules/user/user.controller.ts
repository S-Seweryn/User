import { Controller, Get } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { UserDecorator } from 'lib/decorators'
import { UserMicroserviceCommand } from 'lib/common'
import { User } from 'lib/types'
import { UserService } from './user.service'
import { USER } from './constants'
import { GetUserDto } from './dto'

@Controller(USER)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getMe(@UserDecorator() user: User) {
        return this.userService.getUser(user.userUUID, user.role)
    }

    @MessagePattern({ cmd: UserMicroserviceCommand.GetUser })
    getUser(@Payload() dto: GetUserDto) {
        return this.userService.getUser(dto.userUUID, dto.role)
    }
}
