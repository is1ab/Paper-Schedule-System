export interface AddUserPayloadType {
    id: string,
    name: string,
    role: number,
    email: string
    note: string
}

export interface ModifyUserPayloadType {
    id: string,
    name: string,
    role: number,
    email: string
    note: string
}