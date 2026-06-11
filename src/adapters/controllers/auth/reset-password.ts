import { ResetPasswordMethods } from "../../../use-cases/reset-password/interfaces/methods";
import { response } from "../interfaces/status-code";
import { AuthHttpRequest, AuthHttpResponse } from "./interfaces/http";

export function resetPasswordController(resetPassword: ResetPasswordMethods) {
    async function handle(httpRequest: AuthHttpRequest): Promise<AuthHttpResponse> {
        const res = response();
        const token: string = httpRequest.body?.token ?? "";
        const newPassword: string = httpRequest.body?.newPassword ?? "";

        if (!token) return res.badRequest("Missing body: token");
        if (!newPassword) return res.badRequest("Missing body: newPassword");

        try {
            const result = await resetPassword.run(token, newPassword);
            return res.ok(result);
        } catch (error: any) {
            if (error?.message === "Token inválido ou expirado") return res.badRequest("Token inválido ou expirado");
            return res.serverError(`Internal: ${error}`);
        }
    }

    return { handle };
}
