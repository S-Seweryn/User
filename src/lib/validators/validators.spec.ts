import 'reflect-metadata'
import { Validator } from 'class-validator'
import { IsValidPassword } from './validators'
/* eslint max-classes-per-file: 0 */

describe('validators', () => {
    describe('IsValidPassword', () => {
        class FakeDTO {
            @IsValidPassword()
            password: string

            constructor(password: string) {
                this.password = password
            }
        }

        it('should reject if length is < 8', async () => {
            const model = new FakeDTO('Test123')
            const validator = new Validator()
            const errors = await validator.validate(model)
            expect(errors.length).toEqual(1)
        })

        it('should reject if no Capital letter', async () => {
            const model = new FakeDTO('test1234')
            const validator = new Validator()
            const errors = await validator.validate(model)
            expect(errors.length).toEqual(1)
        })

        it('should pass if length >= 8 and at least 1 Capital character', async () => {
            const model = new FakeDTO('Test1234')
            const validator = new Validator()
            const errors = await validator.validate(model)
            expect(errors.length).toEqual(0)
        })
    })
})
