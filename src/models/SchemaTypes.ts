import { FailedValidation, SuccessfulValidation } from './ValidationResults'

export type SupportedTypes = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any'

export type TypeMapping = {
    string: string
    number: number
    boolean: boolean
    object: Record<string, unknown>
    array: any[]
    any: any
}

export type SchemaDefinition = {
    [key: string]: keyof TypeMapping
}

export type Input<T extends SchemaDefinition> = {
    [K in keyof T]: TypeMapping[T[K]]
}

export type SchemaBlueprint<T extends SchemaDefinition> = {
    check(value: Input<T>): FailedValidation | SuccessfulValidation<{ [K in keyof T]: TypeMapping[T[K]] }>
    length(): number
}

export type SchemaRules = {
    excess?: {
        allow?: boolean
        noClean?: boolean
    }
}
