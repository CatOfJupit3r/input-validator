import {
    Input,
    SchemaBlueprint,
    SchemaDefinition,
    SchemaRules,
    SupportedTypes,
    TypeMapping,
} from '../models/SchemaTypes'
import {
    EXCESS_KEYS_INPUT,
    FailedValidation,
    INTERNAL_ERROR,
    MISSING_KEYS_INPUT,
    SuccessfulValidation,
    VALID_INPUT,
    WRONG_TYPE_INPUT,
} from '../models/ValidationResults'

export class Schema<T extends SchemaDefinition> implements SchemaBlueprint<T> {
    private readonly schema: T
    private readonly rules: SchemaRules

    constructor(schema: T, rules?: SchemaRules) {
        this.schema = schema
        this.rules = rules || {
            excess: 'clean',
        }
    }

    public check(input: Input<T>): FailedValidation | SuccessfulValidation<{ [K in keyof T]: TypeMapping[T[K]] }> {
        try {
            const inputKeys = Object.keys(input)
            const expectedKeys = Object.keys(this.schema)
            if (inputKeys.length < expectedKeys.length) {
                return MISSING_KEYS_INPUT('Missing keys')
            } else if (inputKeys.length > expectedKeys.length && this.rules?.excess === 'forbid') {
                return EXCESS_KEYS_INPUT(
                    'Schema does not allow excess keys. Excess keys: ' +
                        inputKeys.filter(key => !expectedKeys.includes(key)).join(', ')
                )
            }
            for (const [key, type] of Object.entries(this.schema)) {
                if (input[key] === undefined) {
                    return MISSING_KEYS_INPUT('Missing key: ' + key)
                }
                const validation = this.isOfType(input[key], type)
                if (!validation?.success) {
                    return validation
                }
            }
            const cleanInput = { ...input }
            if (this.rules?.excess === 'clean') {
                for (const key in cleanInput) {
                    if (!Object.keys(this.schema).includes(key)) {
                        delete cleanInput[key]
                    }
                }
            }
            return VALID_INPUT(cleanInput as { [K in keyof T]: TypeMapping[T[K]] })
        } catch (error: unknown) {
            console.debug(error)
            return INTERNAL_ERROR('Internal error')
        }
    }

    private isOfType<T extends SupportedTypes>(
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        value: any,
        expectedType: T
    ): FailedValidation | SuccessfulValidation<TypeMapping[T]> {
        try {
            if (value === undefined) {
                return WRONG_TYPE_INPUT('Value is undefined')
            }
            if (expectedType === 'any') {
                return VALID_INPUT(value)
            } else if (expectedType === 'array') {
                if (!Array.isArray(value)) {
                    return WRONG_TYPE_INPUT('Type mismatch. Expected array, got ' + typeof value)
                }
            } else if (expectedType === 'null') {
                if (value !== null) {
                    return WRONG_TYPE_INPUT('Type mismatch. Expected null, got ' + typeof value)
                }
            }
            else if (typeof value !== expectedType) {
                return WRONG_TYPE_INPUT('Type mismatch. Expected ' + expectedType + ', got ' + typeof value)
            }
            return VALID_INPUT(value as TypeMapping[T])
        } catch (error: unknown) {
            return INTERNAL_ERROR('Internal error')
        }
    }

    public length(): number {
        return Object.keys(this.schema).length
    }
}
