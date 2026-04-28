export interface VerifyMagicLinkMethods {
    run(rawToken: string): Promise<{ jwt: string }>;
}
