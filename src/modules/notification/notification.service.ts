import { ClientProxy } from '@nestjs/microservices'
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { lastValueFrom, timeout } from 'rxjs'
import { NOTIFICATION, NOTIFICATION_MICROSERVICE } from './constants'
import { ConfirmMail, NotificationMicroserviceCommand } from './types'

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
