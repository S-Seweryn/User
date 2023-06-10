import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { getConfig } from 'lib/config'
import { UserEntity, UserRefreshTokenEntity, UserRoleEntity } from 'lib/entities'
import { AuthStrategy } from 'lib/types'
import { NotificationModule } from 'modules/notification'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from 'modules/user'
import { JwtStrategy, MailStrategy } from './strategies'
import { GlobalAuthGuard, RolesGuard } from './guards'
import { TeacherModule } from 'modules/teacher'

@Module({
    imports: [
        NotificationModule,
        UserModule,
        TeacherModule,
        TypeOrmModule.forFeature([UserEntity, UserRefreshTokenEntity, UserRoleEntity]),
        PassportModule.register({ defaultStrategy: AuthStrategy.JWT }),
        JwtModule.registerAsync({
            useFactory: () => ({
                privateKey: getConfig().authConfig.jwtPrivateKey,
                publicKey: getConfig().authConfig.jwtPublicKey,
                signOptions: {
                    algorithm: 'RS256',
                    noTimestamp: true
                },
                verifyOptions: {
                    algorithms: ['RS256']
                }
            })
        })
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: GlobalAuthGuard
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        },
        AuthService,
        MailStrategy,
        JwtStrategy
    ],
    controllers: [AuthController]
})
export class AuthModule {}
