import { createParamDecorator, ExecutionContext, ForbiddenException, HttpStatus } from '@nestjs/common'
import { Request } from 'express'
import { HeadersKey } from '../config'
import { ErrorResponse, InternalErrorCode } from '../common'

export const DeviceId = createParamDecorator((_, ctx: ExecutionContext) => {
    const deviceId = ctx.switchToHttp().getRequest<Request>().header(HeadersKey.DeviceId)

    if (!deviceId) {
        const error: ErrorResponse = {
            code: HttpStatus.FORBIDDEN,
            internalCode: InternalErrorCode.MissingDeviceId
        }

        throw new ForbiddenException(error)
    }

    return deviceId
})
