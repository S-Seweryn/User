import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getConfig, envValidation } from 'lib/config'
import { HealthCheckModule } from 'modules/health-check'
import { AuthModule } from 'modules/auth'
import { NotificationModule } from 'modules/notification'
import { UserModule } from 'modules/user'
import { TeacherModule } from 'modules/teacher'
import { AppService } from './app.service'

@Module({
    imports: [
        AuthModule,
        NotificationModule,
        UserModule,
        UserModule,
        TeacherModule,
        HealthCheckModule,
        TypeOrmModule.forRootAsync({
            useFactory: async () => ({
                ...getConfig().typeORMConfig
            })
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            validate: envValidation,
            validationOptions: {
                allowUnknown: true,
                abortEarly: true
            }
        }),
        ThrottlerModule.forRoot(getConfig().throttlerConfig)
    ],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AppModule {}
