export interface AuthCreds {
    email: string;
    login: string;
}

export interface SignupCreds extends AuthCreds {
    fullName: string;
}
