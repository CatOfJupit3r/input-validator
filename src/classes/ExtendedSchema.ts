import {
    NestedSchemaField,
    SchemaBlueprint,
    SchemaFieldDefinition,
    ValidationRules,
} from '../models/ExtendedSchemaTypes'
import {
    EXCESS_KEYS_INPUT,
    FailedValidation,
    INTERNAL_ERROR,
    MISSING_KEYS_INPUT,
    SuccessfulValidation,
    VALID_INPUT,
    WRONG_TYPE_INPUT,
} from '../models/ValidationResults'

const EMAIL_REGEX = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
)

const valueIsObject = (value: any): value is Record<string, unknown> => {
    return typeof value === 'object' && !Array.isArray(value) && value !== null
}

type addFieldOptions<T = any> = {
    callback?: (value: T) => boolean
    undefined?: 'allow' | 'forbid'
}

export class ExtendedSchema<ImpliedType> implements SchemaBlueprint<ImpliedType> {
    private readonly fields: {
        [key: string]: SchemaFieldDefinition | NestedSchemaField
    }
    private readonly rules: ValidationRules

    constructor(rules?: ValidationRules) {
        this.fields = {}
        this.rules = rules || {
            excess: 'clean',
        }
    }

    public addField(key: string, type: SchemaFieldDefinition): void {
        this.fields[key] = type
    }

    public addExtendedSchemaField(
        key: string,
        schema: SchemaBlueprint<any>,
        callback?: (value: any) => boolean,
        allowUndefined?: boolean
    ): void {
        this.fields[key] = {
            typesToCheck: ['extSchema'],
            callback,
            allowUndefined,
            schema,
        } as NestedSchemaField
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public check(value: Record<string, unknown>): SuccessfulValidation<ImpliedType> | FailedValidation {
        try {
            if (!valueIsObject(value)) {
                return WRONG_TYPE_INPUT()
            }

            const valueKeys = Object.keys(value)
            const schemaKeys = Object.keys(this.fields)

            if (valueKeys.length > schemaKeys.length && this.rules?.excess === 'forbid') {
                return EXCESS_KEYS_INPUT()
            }

            const cleanValue = { ...value }
            const encounteredKeys = new Set<string>()

            for (const key in this.fields) {
                const field = this.fields[key]

                const valueToCheck = value[key]

                if (valueToCheck === undefined) {
                    if (!field.undefined || field.undefined === 'forbid') {
                        return WRONG_TYPE_INPUT()
                    }

                    if (field.callback && !field.callback(valueToCheck)) {
                        return WRONG_TYPE_INPUT()
                    }

                    encounteredKeys.add(key)
                    continue
                }

                const type = typeof valueToCheck

                for (const typeToCheck of field.typesToCheck) {
                    if (type === typeToCheck) {
                        continue
                    }
                    if (typeToCheck === 'array' && Array.isArray(valueToCheck)) {
                        // because typeof [] === 'object'
                        continue
                    }
                    if (typeToCheck === 'extSchema' && valueIsObject(valueToCheck)) {
                        if (!('schema' in field) || field?.schema === undefined) {
                            return INTERNAL_ERROR()
                        }
                        const result = field.schema.check(valueToCheck)

                        if (!result.success) {
                            return WRONG_TYPE_INPUT()
                        }
                        continue
                    }
                    if ((typeToCheck === 'object' || typeToCheck === 'extSchema') && valueIsObject(valueToCheck)) {
                        continue
                    }
                    return WRONG_TYPE_INPUT()
                }

                if (field.callback && !field.callback(valueToCheck)) {
                    return WRONG_TYPE_INPUT()
                }

                encounteredKeys.add(key)
            }

            if (encounteredKeys.size < schemaKeys.length) {
                console.log(encounteredKeys, schemaKeys)
                return MISSING_KEYS_INPUT()
            }

            if (this.rules?.excess === 'clean') {
                for (const key in value) {
                    if (!encounteredKeys.has(key)) {
                        delete cleanValue[key]
                    }
                }
            }

            return VALID_INPUT<ImpliedType>(cleanValue as unknown as ImpliedType)
        } catch (error) {
            console.log(error)
            return INTERNAL_ERROR()
        }
    }

    public length(): number {
        return Object.keys(this.fields).length
    }

    public toObject(): Record<string, unknown> {
        // we convert the schema to TypeScript like type
        const obj: Record<string, unknown> = {}
        for (const [key, field] of Object.entries(this.fields)) {
            if (field.typesToCheck)
                obj[key] = field.typesToCheck.length === 1 ? field.typesToCheck[0] : field.typesToCheck.join(' | ')
        }
        return obj
    }

    /* SUGAR */

    public addStringField(key: string, options?: addFieldOptions<string>): void {
        this.addField(key, {
            typesToCheck: ['string'],
            callback: options?.callback,
            undefined: options?.undefined,
        })
    }

    public addNumberField(key: string, options?: addFieldOptions<number>): void {
        this.addField(key, {
            typesToCheck: ['number'],
            callback: options?.callback,
            undefined: options?.undefined,
        })
    }

    public addBooleanField(key: string, options?: addFieldOptions<boolean>): void {
        this.addField(key, {
            typesToCheck: ['boolean'],
            callback: options?.callback,
            undefined: options?.undefined,
        })
    }

    public addArrayField(key: string, options?: addFieldOptions<Array<any>>): void {
        this.addField(key, {
            typesToCheck: ['array'],
            callback: options?.callback,
            undefined: options?.undefined,
        })
    }

    public addEmailField(key: string, options?: addFieldOptions<string>): void {
        this.addRegexField(key, EMAIL_REGEX, options)
    }

    public addRegexField(key: string, regex: RegExp, options?: addFieldOptions<string>): void {
        this.addField(key, {
            typesToCheck: ['string'],
            callback: (value: any) => {
                if (!regex.test(value)) {
                    return false
                }
                return options?.callback ? options.callback(value) : true
            },
            undefined: options?.undefined,
        })
    }

    public addFalsyField(key: string, options?: addFieldOptions<any>): void {
        this.addBooleanField(
            key,
            {
                callback: (value: any) => {
                    return !value
                },
                undefined: options?.undefined,
            }
        )
    }

    public addTruthyField(key: string, options?: addFieldOptions<any>): void {
        this.addBooleanField(
            key,
            {
                callback: (value: any) => {
                    return !!value
                },
                undefined: options?.undefined,
            }
        )
    }

    public addArrayOfElementsField(
        key: string,
        elementSchema: SchemaBlueprint<any>,
        options?: addFieldOptions<Array<any>>
    ): void {
        this.addArrayField(
            key,
            {
                callback: (value: any) => {
                    if (!Array.isArray(value)) {
                        return false
                    }
                    for (const element of value) {
                        const result = elementSchema.check(element)
                        if (!result.success) {
                            return false
                        }
                    }
                    return !options?.callback || options.callback(value)
                },
                undefined: options?.undefined,
            }
        )
    }
}
