import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'
import { NodeEnv } from './constants'

export class EnvironmentVariables {
    @IsOptional()
    @IsEnum(NodeEnv)
    readonly NODE_ENV: NodeEnv = NodeEnv.Development

    @IsOptional()
    @IsNumber()
    readonly API_PORT: number = 3000

    @IsOptional()
    @IsString()
    readonly API_HOST: string = '0.0.0.0'

    @IsOptional()
    @IsInt()
    readonly THROTTLER_TTL_S: number = 60

    @IsOptional()
    @IsInt()
    readonly THROTTLER_LIMIT: number = 100

    @IsOptional()
    @IsString()
    readonly CORS_ALLOWED_ORIGINS: string = '*'

    // default 20 MB
    @IsOptional()
    @IsInt()
    readonly MAX_FILE_SIZE_KB: number = 20 * 1024 * 1024

    @IsOptional()
    @IsString()
    readonly SERVICE_VERSION: string = 'unknown'

    @IsString()
    readonly TYPEORM_CONNECTION: 'mysql' | 'mariadb'

    @IsString()
    readonly TYPEORM_HOST: string

    @IsString()
    readonly TYPEORM_USERNAME: string

    @IsString()
    readonly TYPEORM_PASSWORD: string

    @IsString()
    readonly TYPEORM_DATABASE: string

    @IsInt()
    @IsPositive()
    readonly TYPEORM_PORT: number

    @Type(() => String)
    @IsString()
    readonly TYPEORM_SYNCHRONIZE: string = 'false'

    @Type(() => String)
    @IsString()
    readonly TYPEORM_LOGGING: string = 'false'

    @Type(() => String)
    @IsString()
    readonly TYPEORM_DEBUG: string = 'false'

    @IsOptional()
    @IsString()
    readonly TYPEORM_MIGRATIONS?: string

    @IsOptional()
    @IsString()
    readonly TYPEORM_MIGRATIONS_DIR?: string

    @IsOptional()
    @IsString()
    readonly TYPEORM_ENTITIES?: string

    @IsString()
    readonly JWT_TOKEN_PRIVATE_KEY: string =
        '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAz7pZEypvrFJCDshsbOamj9bmy/dXnUOyCo5b3xSvvTNIoFAC\n5ePXozCD/5Byih1JB6ZYE6OceEW6oArkPzZOl8bFBlqV9k30oerMtVei18+CfF/u\nFLWlJXs9FvXrRTKtsL43OmpLCH3LdzK9/+ZqhEx/TShp3JudUWuRW8ALqrBd8QW5\nCWJHYozYVaIpFzwJ9KW6fJ9GpZfcToCOquLWo8iINnAovXmvcAtdmzgIqoucD988\nf9oerll/CubJLy2rOiyeRvsAYouoefoyQZWN8IYPlnb5IB6Z7qnVL6rZz44dAjVw\nS3uARW3lxpfeZn3TN7wpPkBssGBF0OSEHNrXVwIDAQABAoIBAC8HHCVnpRKZKNVZ\n8JoS+cB0wZmJrK8w5TzYj9oIP+UQmC+bDZzoISiT0j5ogFXeXWs68JO5pbHg72hO\nLvBUpiRcXryag3rYmTqTArdHWNmM5BiuSyMrIHFE3ka1dAcdew8ZcT1rVQNeH1Mk\nDLnDe3fqLaPVM2o7XLlTJfxklP+WN6xWhBgDVgEawneo5svdgblYhg3u7cb4fsHg\ncAf0sCYraVuqcUHa/AUVOx7n5U39x3ShOvOQvFlWEDD6uN4Yg/twW2UyfFDWD57p\n2oPIEf06wOOu2XylPQwEU9w92Fr4yNqk0xksn8sOjbRyEPZncpDICsPTo1nsrz+R\n0AcwWUkCgYEA7DfUujbbg6WrfSOyS718kTeej0Il5z19JYu11g+Sis4r8RWbT92q\nweCp4dCGCpJrsPbs4+s4hT42sKfjUcUy5ZCGTDturQNbhH0RGxPp1KUTrytzdph8\n4mqpCVYcN1AmLCCA0WtFqJ53taWuipcLtU48ZRC4jHI+stUSNCtaE8UCgYEA4R+6\nx5mUjOWAK8GSTgHMWa72KqaxR/osYwmMPtHtjIFm1aOElQaXbGlZKd3dR5Tnw/4R\n8hO/gJc+eQeaPGhri0IVmG66JNTw8q0M0Qd+l0OrarYS5c09XzjAUdGOatstsaNE\nrhgRG90HvVYt0cHyKRa/C4+CnEBod/EoS/UnhGsCgYB5wT1Qzj3PWXFPCzs3du/i\nGf0Mclf/HN6In76WG2i5SxOzLCPlwqflTtvBnS25/Uas7FmmEPQNGcguvhqZZz+Y\nvCm82VVusDBX1e8fOeBozr2aqJbXJjoYqkl+mnfoutMyI37Ccrxw8V1ar4+Lt9c9\nGJpgrYGyQqC2pMTBRyci0QKBgHxc9uXE5ddgAQorCROm0qjIipzNMSo9/b9ISv15\nIu13nsNubZOV7JirKeKC+fbNP6t585fzaNs0sgJSPNYaKS7o9t0abiJisCifiHEA\n3uHZNBzjMFVaqAiuZS/NwAsvwXJca1hxWyI1XE0wCmfR6GDie+96/AAtZIi95DDx\n4T65AoGBAIE5LSP+glxJEd8jU/qc80D/dXf6icURyYDGARw8mziAgw6fL9cwbmqb\nIGDxP1ke2FA8OZ0W4VybRi9UcprenvADYpPb+CPZv4gxGoDFg0Bb/JcFUKL29hC1\nsteX0GR4TKYNeXLC+zz7Qr0DzhpqRswSyHG5GckkIRdgHx4l/Uza\n-----END RSA PRIVATE KEY-----'

    @IsString()
    readonly JWT_TOKEN_PUBLIC_KEY: string =
        '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz7pZEypvrFJCDshsbOam\nj9bmy/dXnUOyCo5b3xSvvTNIoFAC5ePXozCD/5Byih1JB6ZYE6OceEW6oArkPzZO\nl8bFBlqV9k30oerMtVei18+CfF/uFLWlJXs9FvXrRTKtsL43OmpLCH3LdzK9/+Zq\nhEx/TShp3JudUWuRW8ALqrBd8QW5CWJHYozYVaIpFzwJ9KW6fJ9GpZfcToCOquLW\no8iINnAovXmvcAtdmzgIqoucD988f9oerll/CubJLy2rOiyeRvsAYouoefoyQZWN\n8IYPlnb5IB6Z7qnVL6rZz44dAjVwS3uARW3lxpfeZn3TN7wpPkBssGBF0OSEHNrX\nVwIDAQAB\n-----END PUBLIC KEY-----'

    @IsString()
    readonly AUTH_COOKIE_NAME: string = 'auth-token'

    @IsString()
    readonly AUTH_QUERY_PARAM_NAME: string = 'auth-token'

    @IsString()
    readonly API_URL: string

    @IsOptional()
    @IsString()
    readonly REDIS_HOST: string = 'localhost'

    @IsOptional()
    @IsInt()
    readonly REDIS_PORT: number = 6379

    @IsOptional()
    @IsString()
    readonly REDIS_PREFIX: string = 'user-api'

    @IsString()
    readonly USER_MICROSERVICE_PREFIX: string

    @IsString()
    readonly NOTIFICATION_MICROSERVICE_PREFIX: string

    @IsString()
    readonly AWS_S3_REGION: string

    @IsString()
    readonly AWS_S3_BUCKET_NAME: string

    @IsNumber()
    readonly AWS_S3_EXPIRES_IN: number
}
