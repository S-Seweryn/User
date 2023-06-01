import { Body, Controller, Post, UseGuards, Res, HttpStatus, HttpCode, Get, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'
import { getConfig } from 'lib/config'
import { Public, UserDecorator, DeviceId, Roles } from 'lib/decorators'
import { AuthStrategy, User } from 'lib/types'
import { en_US } from 'lib/locale'
import { R } from 'lib/utils'
import { Role } from 'lib/common'
import { NotificationService } from 'modules/notification'
import { UserService } from 'modules/user'
import { AuthService } from './auth.service'
import { MailLoginDto, RefreshTokenDto, RegisterDto, RegistrationConfirmDto, TeacherRegisterDto } from './dto'
import { AUTH } from './constants'
import { UserToken } from './types'

const T = en_US.auth

@Controller(AUTH)
export class AuthController {
    private readonly apiUrl: string

    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly notificationService: NotificationService,
        private readonly userService: UserService
    ) {
        this.apiUrl = getConfig().expressConfig.apiUrl
    }

    @Public()
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const { email, userUUID } = await this.authService.registerUser(dto)
        const jwtToken = this.jwtService.sign({ userUUID }, { expiresIn: '1d' })

        const appLink = `${this.apiUrl}/auth/register-confirm?token=${jwtToken}`

        await this.notificationService.confirmMail({
            email,
            appLink
        })

        return email
    }

    @Post('teacher-register')
    @Roles(Role.Admin)
    async teacherRegister(@Body() dto: TeacherRegisterDto) {
        const { email, userUUID } = await this.authService.registerTeacher(dto)
        const jwtToken = this.jwtService.sign({ userUUID }, { expiresIn: '1d' })

        const appLink = `${this.apiUrl}/auth/register-confirm?token=${jwtToken}`

        await this.notificationService.confirmMail({
            email,
            appLink
        })

        return email
    }

    @Public()
    @Get('register-confirm')
    async registerConfirm(@Query() dto: RegistrationConfirmDto) {
        const data = await this.jwtService.verifyAsync<UserToken>(dto.token.trim()).catch(R.always(undefined))

        if (!data) {
            return { error: T.expiredToken }
        }

        const isUserConfirmed = await this.userService.confirmUser(data.userUUID)

        if (!isUserConfirmed) {
            return {
                error: T.linkExpired
            }
        }

        return {
            message: T.accountConfirm
        }
    }

    @Public()
    @Post('login')
    @UseGuards(AuthGuard(AuthStrategy.Mail))
    async loginWithMail(
        @Body() dto: MailLoginDto,
        @UserDecorator() user: User,
        @DeviceId() deviceId: string,
        @Res({ passthrough: true }) res: Response
    ) {
        const { accessToken, refreshToken } = await this.authService.getTokens(user, deviceId)
        res.cookie(getConfig().authConfig.cookieName, accessToken, {
            secure: true
        })

        return {
            accessToken,
            refreshToken
        }
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    logout(@UserDecorator() user: User, @DeviceId() deviceId: string, @Res({ passthrough: true }) res: Response) {
        res.cookie(getConfig().authConfig.cookieName, '', { secure: true })

        return this.authService.removeTokens(user.userUUID, deviceId)
    }

    @Public()
    @Post('refresh-token')
    async refreshToken(@Body() dto: RefreshTokenDto, @DeviceId() deviceId: string, @Res({ passthrough: true }) res: Response) {
        const { accessToken } = await this.authService.refreshToken(dto.refreshToken, deviceId)
        res.cookie(getConfig().authConfig.cookieName, accessToken, {
            secure: true
        })

        return { accessToken }
    }
}
