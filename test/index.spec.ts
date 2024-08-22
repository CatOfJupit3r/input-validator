import { Schema } from '../src'
import { FailedValidation, SuccessfulValidation } from '../src/models/ValidationResults'
import InputValidator from '../src'

describe('InputValidator', () => {
    let validator: InputValidator

    beforeEach(() => {
        validator = new InputValidator()
    })

    test('valid input matching the schema', () => {
        const schema: Schema = {
            name: 'string',
            age: 'number',
        }
        const input = {
            name: 'John',
            age: 30,
        }
        const result = validator.isOfSchema(input, schema)
        expect(result).toEqual({
            success: true,
            value: input,
        } as SuccessfulValidation<typeof input>)
    })

    test('input with missing keys', () => {
        const schema: Schema = {
            name: 'string',
            age: 'number',
        }
        const input = {
            name: 'John',
        }
        const result = validator.isOfSchema(input, schema)
        expect(result).toEqual({
            success: false,
            type: 'MISSING_KEYS',
        } as FailedValidation)
    })

    test('input with excess keys', () => {
        const schema: Schema = {
            name: 'string',
            age: 'number',
        }
        const input = {
            name: 'John',
            age: 30,
            extra: 'extra',
        }
        const result = validator.isOfSchema(input, schema)
        expect(result).toEqual({
            success: false,
            type: 'EXCESS_KEYS',
        } as FailedValidation)
    })

    test('input with wrong types', () => {
        const schema: Schema = {
            name: 'string',
            age: 'number',
        }
        const input = {
            name: 'John',
            age: 'thirty',
        }
        const result = validator.isOfSchema(input, schema)
        expect(result).toEqual({
            success: false,
            type: 'WRONG_TYPE',
        } as FailedValidation)
    })
})
