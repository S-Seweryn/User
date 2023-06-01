/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationOptions, registerDecorator } from 'class-validator'
import { isValidPassword } from '../common'

export const IsValidPassword = (validationOptions?: ValidationOptions) => (object: any, propertyName: string) =>
    registerDecorator({
        name: 'IsValidPassword',
        target: object.constructor,
        propertyName,
        options: validationOptions,
        validator: {
            validate: (value: any) => isValidPassword(value)
        }
    })
