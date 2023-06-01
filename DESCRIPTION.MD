## User microservice
    User microservice is an autonomous part of the system, responsible for managing users.
    It is built on microservice architecture and uses the NestJS framework.
    Its main functions are registration, login, user data management.

    Microservice User provides a rich set of functions, such as creating and user profiles,
    managing personal data such as name, email address and password, and the ability to add 
    profile pictures using AWS S3. In addition, the microservice enables user authentication 
    through an authentication mechanism such as JWT tokens.

    User microservice also works with other microservices such as Schedule, Order,
    Video to provide full system functionality. It operates as an independent unit,
    allowing the entire system to scale and remain flexible.

## Code example

Three roles are available:

```javascript
export enum Role {
    Admin = 'admin',
    Teacher = 'teacher',
    Student = 'student'
}
```

User registration:

```javascript
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
```

Connection to notification microservice:

```javascript
@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NOTIFICATION, { timestamp: true })

    constructor(@Inject(NOTIFICATION_MICROSERVICE) private client: ClientProxy) {}

    confirmMail(request: ConfirmMail) {
        return lastValueFrom(
            this.client.send<boolean, ConfirmMail>({ cmd: NotificationMicroserviceCommand.ConfirmMail }, request).pipe(timeout(2500)),
            { defaultValue: false }
        ).catch(error => {
            this.logger.error(error, new Date())

            throw new HttpException(error, error.code || HttpStatus.BAD_REQUEST)
        })
    }
}
```

The administrator when adding a teacher must have his photo, description and language:

```javascript
export class TeacherRegisterDto extends RegisterDto {
    @IsEnum(Language)
    readonly language: Language

    @IsString()
    readonly description: string

    @IsString()
    readonly imageBase64: string
}
```

The images are stored on AWS S3:

```javascript
    async uploadImage(imageBase64: string) {
        const imageBuff = Buffer.from(imageBase64, 'base64')
        const imageKey = randomUUID()

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: imageKey,
                ContentType: 'image',
                ContentEncoding: 'base64',
                Body: imageBuff
            })
        )

        return imageKey
    }
```
