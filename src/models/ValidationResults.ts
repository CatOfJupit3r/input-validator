export interface SuccessfulValidation<T = any> {
    success: true
    value: T
}

type TypeOfFailure = 'WRONG_TYPE' | 'MISSING_KEYS' | 'EXCESS_KEYS' | 'INTERNAL_ERROR'

export interface FailedValidation {
    success: false
    type: TypeOfFailure
}

export const VALID_INPUT = <T>(value: T): SuccessfulValidation<T> => ({ success: true, value })
export const INVALID_INPUT = (type: TypeOfFailure): FailedValidation => ({
    success: false,
    type,
})
export const WRONG_TYPE_INPUT = (): FailedValidation => {
    return INVALID_INPUT('WRONG_TYPE')
}
export const MISSING_KEYS_INPUT = (): FailedValidation => {
    return INVALID_INPUT('MISSING_KEYS')
}
export const EXCESS_KEYS_INPUT = (): FailedValidation => {
    return INVALID_INPUT('EXCESS_KEYS')
}
export const INTERNAL_ERROR = (): FailedValidation => {
    return INVALID_INPUT('INTERNAL_ERROR')
}
