import { FailedValidation, SuccessfulValidation } from './ValidationResults'

type SupportedTypes = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null'

type SchemaCallback = (value: any) => boolean | [boolean, string]

export interface SchemaFieldDefinition {
    typesToCheck: Array<SupportedTypes>
    callback?: SchemaCallback
    undefined?: 'allow' | 'forbid'
    displayedAs?: string
}

export interface NestedSchemaField {
    typesToCheck: ['extSchema']
    callback?: SchemaCallback
    undefined?: 'allow' | 'forbid'
    schema: SchemaBlueprint<any>
}

export interface SchemaBlueprint<ImpliedType> {
    addField(key: string, type: SchemaFieldDefinition): void
    check(value: any): SuccessfulValidation<ImpliedType> | FailedValidation
    length(): number
    toJSON(): Record<string, unknown>
}

type EXCESS_ALLOW_FLAGS = 'keep' | 'clean' | 'forbid'

export interface ValidationRules {
    excess?: EXCESS_ALLOW_FLAGS
}
