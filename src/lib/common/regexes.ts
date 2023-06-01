export const isValidPassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z~!@#$%^&*()_+`<>,.'";:|?/[\]{}\d]{8,}$/.test(password)
