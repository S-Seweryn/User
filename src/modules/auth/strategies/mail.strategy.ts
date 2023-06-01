import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { Request } from 'express'
import { AuthStrategy } from 'lib/types'
import { AuthService } from '../auth.service'

@Injectable()
export class MailStrategy extends PassportStrategy(Strategy, AuthStrategy.Mail) {
    constructor(private readonly authService: AuthService) {
        super({
            passReqToCallback: true,
            usernameField: 'email'
        })
    }

    validate(req: Request, email: string, password: string) {
        return this.authService.loginWithMail(email, password, req.body.role)
    }
}
