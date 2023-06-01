import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { AuthStrategy } from 'lib/types'
import { DecoratorName } from 'lib/common'

@Injectable()
export class GlobalAuthGuard extends AuthGuard(AuthStrategy.JWT) implements CanActivate {
    constructor(private reflector: Reflector) {
        super()
    }

    public canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.get<boolean | undefined>(DecoratorName.Public, context.getHandler())

        if (isPublic) {
            return true
        }

        return super.canActivate(context)
    }
}
