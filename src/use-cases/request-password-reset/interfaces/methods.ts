export interface RequestPasswordResetMethods {
    run(email: string): Promise<void>;
}
