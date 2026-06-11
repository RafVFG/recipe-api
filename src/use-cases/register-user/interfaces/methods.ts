export interface RegisterUserMethods {
    run(name: string, email: string, password: string): Promise<void>;
}
