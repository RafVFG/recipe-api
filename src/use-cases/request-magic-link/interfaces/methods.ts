export interface RequestMagicLinkMethods {
    run(email: string): Promise<void>;
}
