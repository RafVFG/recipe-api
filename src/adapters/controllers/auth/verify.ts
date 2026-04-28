import { VerifyMagicLinkMethods } from "../../../use-cases/verify-magic-link/interfaces/methods";
import { response } from "../interfaces/status-code";
import { AuthHttpRequest, AuthHttpResponse } from "./interfaces/http";

export function authVerifyController(verifyMagicLink: VerifyMagicLinkMethods) {
    async function handle(httpRequest: AuthHttpRequest): Promise<AuthHttpResponse> {
        const { token } = httpRequest.query;
        const res = response();

        if (!token) return res.badRequest("Missing param: token");

        try {
            const result = await verifyMagicLink.run(token as string);
            return res.ok(result);
        } catch (error: any) {
            if (error.message === "Link expirado" || error.message === "Token inválido") {
                return res.unauthorized(error.message);
            }
            return res.serverError(`Internal: ${error.message}`);
        }
    }

    return { handle };
}
