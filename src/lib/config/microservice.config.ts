import { Transport } from '@nestjs/microservices'
import { EnvironmentVariables } from './environment.variables'
import { redisConfig } from './redis.config'

export const microserviceConfig = (configEnvs: EnvironmentVariables) => ({
    userMicroservicePrefix: configEnvs.USER_MICROSERVICE_PREFIX,
    notificationMicroservicePrefix: configEnvs.NOTIFICATION_MICROSERVICE_PREFIX
})
