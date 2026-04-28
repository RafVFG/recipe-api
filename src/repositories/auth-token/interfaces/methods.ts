export interface AuthTokenData {
    id: number;
    idUser: number;
    hash: string;
    expires_at: Date;
}

export interface AuthTokenRepositoryMethods {
    create(data: { idUser: number; hash: string; expiresAt: Date }): Promise<void>;
    findByHash(hash: string): Promise<AuthTokenData | null>;
    deleteByHash(hash: string): Promise<void>;
}
