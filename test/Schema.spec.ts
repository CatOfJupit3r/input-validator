import { FailedValidation, SuccessfulValidation } from '../src'
import { Schema } from '../src'

const NameAgeSchema = new Schema({
    name: 'string',
    age: 'number',
})

describe('Schema', () => {
    test('valid input matching the schema', () => {
        const input = {
            name: 'John',
            age: 30,
        }
        const result = NameAgeSchema.check(input)
        // const result = validator.isOfSchema(input, schema)
        expect(result).toEqual({
            success: true,
            value: input,
        } as SuccessfulValidation<typeof input>)
    })

    test('input with missing keys', () => {
        const input: any = {
            name: 'John',
        }
        const result = NameAgeSchema.check(input)
        expect(result).toEqual({
            success: false,
            type: 'MISSING_KEYS',
        } as FailedValidation)
    })

    test('input with excess keys', () => {
        const input = {
            name: 'John',
            age: 30,
            extra: 'extra',
        }
        const result = NameAgeSchema.check(input)
        expect(result).toEqual({
            success: false,
            type: 'EXCESS_KEYS',
        } as FailedValidation)
    })

    test('input with excess keys, but schema allows it', () => {
        const NameAgeSchemaWithExcess = new Schema(
            {
                name: 'string',
                age: 'number',
            },
            {
                excess: {
                    allow: true,
                },
            }
        )
        const input = {
            name: 'John',
            age: 30,
            extra: 'extra',
        }
        const result = NameAgeSchemaWithExcess.check(input)
        expect(result).toEqual({
            success: true,
            value: input,
        } as SuccessfulValidation<typeof input>)
    })

    test('input with wrong types', () => {
        const input: any = {
            name: 'John',
            age: 'thirty',
        }
        const result = NameAgeSchema.check(input)
        expect(result).toEqual({
            success: false,
            type: 'WRONG_TYPE',
        } as FailedValidation)
    })
})
