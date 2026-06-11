export interface LoginMethods {
    run(email: string, password: string): Promise<{ jwt: string }>;
}
