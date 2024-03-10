export interface LoginRequestPayload {
    account: string,
    password: string
}

export interface LoginResponse {
    status: string,
    token: string
}