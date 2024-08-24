import { ExtendedSchema, SuccessfulValidation } from '../src'

interface TestSchemaInterface {
    name: string
    email: string
    age: number
    phone: string

    address: {
        notifications: boolean
        theme: string
    }
    groups: string[]
    friends: {
        name: string
        age: number
    }[]
    isMale?: boolean
}

/*

Test suite for the ExtendedSchema class


 */

describe('Extended Schema', () => {
    test('Extended Schema sugar methods add fields as intended', () => {
        const schema = new ExtendedSchema<TestSchemaInterface>()
        schema.addStringField('name')
        schema.addNumberField('age')
        schema.addEmailField('email')
        schema.addRegexField('phone', /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/gm)
        const addressSchema = new ExtendedSchema<{ notifications: boolean; theme: string }>()
        addressSchema.addBooleanField('notifications')
        addressSchema.addStringField('theme')

        schema.addExtendedSchemaField('address', addressSchema)
        schema.addArrayField('groups', {
            callback: value => {
                return value.every((v: any) => typeof v === 'string')
            },
        })

        const friendsSchema = new ExtendedSchema<{ name: string; age: number }>()
        friendsSchema.addStringField('name')
        friendsSchema.addNumberField('age')
        schema.addArrayOfElementsField<{ name: string; age: number }>('friends', friendsSchema)

        schema.addFalsyField('isMale', {
            callback: value => true,
            undefined: 'allow',
        })

        const objectToCheck = {
            name: 'John',
            email: 'fakeemail@gmail.com',
            age: 30,
            phone: '123-456-7890',
            address: {
                notifications: true,
                theme: 'dark',
            },
            groups: ['group1', 'group2'],
            friends: [
                {
                    name: 'Jane',
                    age: 25,
                },
                {
                    name: 'Jack',
                    age: 35,
                },
            ],
        }

        const result = schema.check(objectToCheck)

        expect(result).toEqual({
            success: true,
            value: objectToCheck,
        } as SuccessfulValidation<TestSchemaInterface>)
    })

    test('Schema cleans excess keys on rule', () => {
        const schema = new ExtendedSchema<TestSchemaInterface>({ excess: 'clean' })

        schema.addStringField('name')
        schema.addNumberField('age')
        schema.addEmailField('email')

        const objectToCheck = {
            name: 'John',
            age: 30,
            email: 'fakeemail@gmail.com',
            extra: 'extra',
        }

        const result = schema.check(objectToCheck)

        expect(result).toEqual({
            success: true,
            value: {
                name: 'John',
                age: 30,
                email: 'fakeemail@gmail.com',
            },
        } as SuccessfulValidation<TestSchemaInterface>)
    })

    test('Extended Schema does not accept non-object values', () => {
        const schema = new ExtendedSchema<TestSchemaInterface>()

        schema.addStringField('name')
        schema.addNumberField('age')
        schema.addEmailField('email')

        const objectToCheck = 'John'

        const result = schema.check(objectToCheck as any)

        expect(result).toHaveProperty('success', false)
    })

    test('Custom validation callback', () => {
        const schema = new ExtendedSchema<TestSchemaInterface>()
        schema.addStringField('name', {
            callback: value => value.length > 3,
        })

        const objectToCheck = {
            name: 'John',
        }

        const result = schema.check(objectToCheck)

        expect(result).toEqual({
            success: true,
            value: objectToCheck,
        } as SuccessfulValidation<{ name: string }>)
    })

    test('Callback does not trigger exceptions, but returns validation fail', () => {
        const schema = new ExtendedSchema<TestSchemaInterface>()
        schema.addStringField('name', {
            callback: value => {
                throw new Error('Error')
            },
        })

        const objectToCheck = {
            name: 'John',
        }

        const result = schema.check(objectToCheck)

        expect(result).toHaveProperty('success', false)
    })
})
