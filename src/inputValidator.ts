import { Input, Schema, SupportedTypes, TypeMapping } from './models/Schema'
import {
    EXCESS_KEYS_INPUT,
    FailedValidation,
    INTERNAL_ERROR,
    MISSING_KEYS_INPUT,
    SuccessfulValidation,
    VALID_INPUT,
    WRONG_TYPE_INPUT,
} from './models/ValidationResults'

class InputValidator {
    public isOfSchema<T extends Schema>(
        input: Input<T>,
        expected: T
    ): FailedValidation | SuccessfulValidation<{ [K in keyof T]: TypeMapping[T[K]] }> {
        try {
            const inputKeysLength = Object.keys(input).length
            const expectedKeysLength = Object.keys(expected).length
            if (inputKeysLength < expectedKeysLength) {
                return MISSING_KEYS_INPUT()
            } else if (inputKeysLength > expectedKeysLength) {
                return EXCESS_KEYS_INPUT()
            }
            for (const [key, type] of Object.entries(expected)) {
                if (input[key] === undefined) {
                    return WRONG_TYPE_INPUT()
                }
                const validation = this.isOfType(input[key], type)
                if (!validation?.success) {
                    return WRONG_TYPE_INPUT()
                }
            }
            return VALID_INPUT(input as { [K in keyof T]: TypeMapping[T[K]] })
        } catch (error: unknown) {
            return INTERNAL_ERROR()
        }
    }

    public isOfType<T extends SupportedTypes>(
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        value: any,
        expectedType: T
    ): FailedValidation | SuccessfulValidation<TypeMapping[T]> {
        try {
            if (value === undefined) {
                return WRONG_TYPE_INPUT()
            }
            if (expectedType === 'any') {
                return VALID_INPUT(value)
            } else if (expectedType === 'array') {
                if (!Array.isArray(value)) {
                    return WRONG_TYPE_INPUT()
                }
            } else if (typeof value !== expectedType) {
                return WRONG_TYPE_INPUT()
            }
            return VALID_INPUT(value as TypeMapping[T])
        } catch (error: unknown) {
            console.log(error)
            return INTERNAL_ERROR()
        }
    }
}

export default InputValidator
