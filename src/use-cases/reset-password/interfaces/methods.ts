export interface ResetPasswordMethods {
    run(rawToken: string, newPassword: string): Promise<{ jwt: string }>;
}
