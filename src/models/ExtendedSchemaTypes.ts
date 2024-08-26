import { FailedValidation, SuccessfulValidation } from './ValidationResults'

type SupportedTypes = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null'

export interface SchemaFieldDefinition {
    typesToCheck: Array<SupportedTypes>
    callback?: (value: any) => boolean
    undefined?: 'allow' | 'forbid'
}

export interface NestedSchemaField {
    typesToCheck: ['extSchema']
    callback?: (value: any) => boolean
    undefined?: 'allow' | 'forbid'
    schema: SchemaBlueprint<any>
}

export interface SchemaBlueprint<ImpliedType> {
    addField(key: string, type: SchemaFieldDefinition): void

    check(value: any): SuccessfulValidation<ImpliedType> | FailedValidation

    length(): number
}

type EXCESS_ALLOW_FLAGS = 'keep' | 'clean' | 'forbid'

export interface ValidationRules {
    excess?: EXCESS_ALLOW_FLAGS
}
