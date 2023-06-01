import { Role } from 'lib/common'

export type NewUser = {
    firstName: string
    lastName: string
    email: string
    password: string
    userRoleUUID: string
}

export type LoginWithProviderCredential = {
    fullName: string
    email: string
    authToken: string
}

export type UserToken = {
    userUUID: string
}
