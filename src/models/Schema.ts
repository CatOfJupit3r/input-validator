export type SupportedTypes = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any'

export type TypeMapping = {
    string: string
    number: number
    boolean: boolean
    object: Record<string, unknown>
    array: any[]
    any: any
    // objectId: Types.ObjectId | string
}

export type Schema = {
    [key: string]: keyof TypeMapping
}

export type Input<T extends Schema> = {
    [K in keyof T]: TypeMapping[T[K]]
}
