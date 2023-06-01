import { Injectable, BadRequestException, UnauthorizedException, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Connection, Repository } from 'typeorm'
import { UserRefreshTokenEntity, UserRoleEntity } from 'lib/entities'
import { TokenTypes, TokenPayload, AuthProvider, User } from 'lib/types'
import { ErrorResponse, InternalErrorCode, Role } from 'lib/common'
import { en_US } from 'lib/locale'
import { TeacherService } from 'modules/teacher'
import { UserService } from 'modules/user'
import { RegisterDto, TeacherRegisterDto } from './dto'

const T = en_US.auth

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRefreshTokenEntity)
        private userRefreshTokenRepository: Repository<UserRefreshTokenEntity>,
        @InjectRepository(UserRoleEntity)
        private userRoleRepository: Repository<UserRoleEntity>,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly teacherService: TeacherService,
        private readonly db: Connection
    ) {}

    async registerUser(dto: RegisterDto) {
        const { firstName, lastName, email, password } = dto
        const userRoleUUID = await this.getUserRoleUUID(Role.Student)
        const isEmailRegistered = await this.userService.checkEmail(email, userRoleUUID)

        if (isEmailRegistered) {
            throw new BadRequestException()
        }

        const user = {
            firstName,
            lastName,
            email,
            password,
            userRoleUUID
        }
        const addedUser = await this.userService.addUser(user)

        return {
            email,
            userUUID: addedUser.userUUID
        }
    }

    async registerTeacher(dto: TeacherRegisterDto) {
        const { firstName, lastName, email, password } = dto
        const userRoleUUID = await this.getUserRoleUUID(Role.Teacher)
        const isEmailRegistered = await this.userService.checkEmail(email, userRoleUUID)

        if (isEmailRegistered) {
            throw new BadRequestException()
        }

        const user = {
            firstName,
            lastName,
            email,
            password,
            userRoleUUID
        }

        return this.db.transaction(async manager => {
            const addedUser = await this.userService.addUser(user, manager)
            const teacher = { teacherUUID: addedUser.userUUID, ...dto }

            await this.teacherService.addTeacher(teacher, manager)

            return {
                email,
                userUUID: addedUser.userUUID
            }
        })
    }

    async loginWithMail(email: string, password: string, role: Role) {
        const registeredUser = await this.userService.getUserByEmail(email, password, role)

        if (!registeredUser) {
            throw new UnauthorizedException()
        }

        return {
            userUUID: registeredUser.userUUID,
            role
        }
    }

    async getTokens(user: User, deviceId: string) {
        const [accessToken, refreshToken] = await Promise.all([this.getAccessToken(user), this.getRefreshToken(user, deviceId)])

        return {
            accessToken,
            refreshToken
        }
    }

    removeTokens(userUUID: string, deviceId: string) {
        return this.userRefreshTokenRepository.delete({
            userUUID,
            deviceId
        })
    }

    async refreshToken(refreshToken: string, deviceId: string) {
        const tokenPayload = await this.jwtService.verifyAsync<TokenPayload>(refreshToken).catch(() => {
            const error: ErrorResponse = {
                code: HttpStatus.BAD_REQUEST,
                internalCode: InternalErrorCode.VerifyRefreshToken,
                message: T.invalidTokenUsed
            }

            throw new BadRequestException(error)
        })

        if (tokenPayload.tokenUse !== TokenTypes.RefreshToken) {
            const error: ErrorResponse = {
                code: HttpStatus.BAD_REQUEST,
                internalCode: InternalErrorCode.VerifyRefreshToken,
                message: T.invalidTokenType
            }

            throw new BadRequestException(error)
        }

        const token = await this.userRefreshTokenRepository
            .findOne({
                select: ['userUUID'],
                where: {
                    userUUID: tokenPayload.sub,
                    deviceId
                }
            })
            .then(Boolean)

        if (!token) {
            const error: ErrorResponse = {
                code: HttpStatus.BAD_REQUEST,
                internalCode: InternalErrorCode.RefreshTokenNotFound,
                message: T.invalidTokenUsed
            }

            throw new BadRequestException(error)
        }

        const user = {
            userUUID: tokenPayload.sub,
            role: tokenPayload.payload.role
        }

        const accessToken = this.getAccessToken(user)

        return {
            accessToken
        }
    }

    async getLoggedUser(userUUID: string) {
        return this.userService.getUser(userUUID)
    }

    private async getUserRoleUUID(role: Role) {
        const userRole = await this.userRoleRepository.findOne({
            select: ['userRoleUUID'],
            where: { role }
        })

        if (!userRole) {
            throw new BadRequestException()
        }

        return userRole.userRoleUUID
    }

    private getAccessToken(user: User) {
        const { userUUID, role } = user

        const payload = {
            tokenUse: TokenTypes.AccessToken,
            payload: {
                role
            }
        }

        const options = {
            expiresIn: '1d',
            subject: userUUID
        }

        return this.jwtService.sign(payload, options)
    }

    private async getRefreshToken(user: User, deviceId: string) {
        const { userUUID, role } = user

        const payload = {
            tokenUse: TokenTypes.RefreshToken,
            payload: {
                role
            }
        }

        const refreshToken = this.jwtService.sign(payload, { subject: userUUID })

        const userRefreshTokenUUID = await this.userRefreshTokenRepository
            .findOne({ where: { userUUID, deviceId } })
            .then(userToken => userToken?.userRefreshTokenUUID)

        await this.userRefreshTokenRepository.save({
            userRefreshTokenUUID,
            token: refreshToken,
            userUUID,
            deviceId
        })

        return refreshToken
    }
}
