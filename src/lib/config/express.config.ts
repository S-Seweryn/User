import { EnvironmentVariables } from './environment.variables'

export const expressConfig = (configEnvs: EnvironmentVariables) => ({
    port: configEnvs.API_PORT,
    host: configEnvs.API_HOST,
    apiUrl: configEnvs.API_URL,
    microservicePrefix: configEnvs.USER_MICROSERVICE_PREFIX
})
