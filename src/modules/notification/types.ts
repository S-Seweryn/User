export enum NotificationMicroserviceCommand {
    ConfirmMail = 'confirm-mail'
}

export type ConfirmMail = {
    email: string
    appLink: string
}
