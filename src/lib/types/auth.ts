export type TokenPayload = {
    iat: number
    exp: number
    tokenUse: string
    sub: string
    payload: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any
    }
}

export enum TokenTypes {
    AccessToken = 'access-token',
    RefreshToken = 'refresh-token'
}

export enum AuthStrategy {
    JWT = 'jwt',
    Mail = 'mail',
    Apple = 'apple'
}

export enum AuthProvider {
    Apple = 'apple'
}
