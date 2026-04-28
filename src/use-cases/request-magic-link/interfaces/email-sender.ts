export interface EmailSenderMethods {
    send(data: { to: string; subject: string; html: string }): Promise<void>;
}
