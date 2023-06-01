import { EnvironmentVariables } from './environment.variables'

export const awsS3Config = (configEnvs: EnvironmentVariables) => ({
    bucketName: configEnvs.AWS_S3_BUCKET_NAME,
    region: configEnvs.AWS_S3_REGION,
    expiresIn: configEnvs.AWS_S3_EXPIRES_IN
})
