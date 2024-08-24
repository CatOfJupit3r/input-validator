import { Schema, SuccessfulValidation } from '../src'

const NameAgeSchema = new Schema({
    name: 'string',
    age: 'number',
})

describe('Schema', () => {
    test('Schema returns success on valid object', () => {
        const input = {
            name: 'John',
            age: 30,
        }
        const result = NameAgeSchema.check(input)
        expect(result).toEqual({
            success: true,
            value: input,
        } as SuccessfulValidation<typeof input>)
    })

    test('Schema fails validation on missing keys', () => {
        const input: any = {
            name: 'John',
        }
        const result = NameAgeSchema.check(input)
        expect(result).toHaveProperty('success', false)
    })

    test('Schema cleans up excess keys by default', () => {
        const input = {
            name: 'John',
            age: 30,
            extra: 'extra',
        }
        const result = NameAgeSchema.check(input)
        expect(result).toHaveProperty('success', true)
        expect(result).toHaveProperty('value', { name: 'John', age: 30 })
    })

    test('Input with excess keys, but schema forbids it', () => {
        const NameAgeSchemaWithExcess = new Schema(
            {
                name: 'string',
                age: 'number',
            },
            {
                excess: 'forbid',
            }
        )
        const input = {
            name: 'John',
            age: 30,
            extra: 'extra',
        }
        const result = NameAgeSchemaWithExcess.check(input)
        expect(result).toHaveProperty('success', false)
    })

    test('Schema fails validation on bad types', () => {
        const input: any = {
            name: 'John',
            age: 'thirty',
        }
        const result = NameAgeSchema.check(input)
        expect(result).toHaveProperty('success', false)
    })
})
