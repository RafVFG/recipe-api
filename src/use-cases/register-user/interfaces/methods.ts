export interface RegisterUserMethods {
    run(name: string, email: string): Promise<void>;
}
