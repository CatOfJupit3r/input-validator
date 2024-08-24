export interface SuccessfulValidation<T = any> {
    success: true
    value: T
}

type TypeOfFailure = 'WRONG_TYPE' | 'MISSING_KEYS' | 'EXCESS_KEYS' | 'INTERNAL_ERROR'

export interface FailedValidation {
    success: false
    type: TypeOfFailure
    message: string
}

export const VALID_INPUT = <T>(value: T): SuccessfulValidation<T> => ({ success: true, value })
export const INVALID_INPUT = (type: TypeOfFailure, message: string): FailedValidation => ({
    success: false,
    type,
    message
})
export const WRONG_TYPE_INPUT = (message: string): FailedValidation => {
    return INVALID_INPUT('WRONG_TYPE', message)
}
export const MISSING_KEYS_INPUT = (message: string): FailedValidation => {
    return INVALID_INPUT('MISSING_KEYS', message)
}
export const EXCESS_KEYS_INPUT = (message: string): FailedValidation => {
    return INVALID_INPUT('EXCESS_KEYS', message)
}
export const INTERNAL_ERROR = (message: string): FailedValidation => {
    return INVALID_INPUT('INTERNAL_ERROR', message)
}
