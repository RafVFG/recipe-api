export interface AuthTokenData {
    id: number;
    idUser: number;
    hash: string;
    type: 'magic_link' | 'password_reset';
    expires_at: Date;
}

export interface AuthTokenRepositoryMethods {
    create(data: { idUser: number; hash: string; expiresAt: Date; type: 'magic_link' | 'password_reset' }): Promise<void>;
    findByHash(hash: string, type: 'magic_link' | 'password_reset'): Promise<AuthTokenData | null>;
    deleteByHash(hash: string): Promise<void>;
}
