import { RequestMagicLinkMethods } from "../../../use-cases/request-magic-link/interfaces/methods";
import { response } from "../interfaces/status-code";
import { AuthHttpRequest, AuthHttpResponse } from "./interfaces/http";

export function authRequestController(requestMagicLink: RequestMagicLinkMethods) {
    async function handle(httpRequest: AuthHttpRequest): Promise<AuthHttpResponse> {
        const { email } = httpRequest.body;
        const res = response();

        if (!email) return res.badRequest("Missing param: email");

        try {
            await requestMagicLink.run(email);
        } catch (error: any) {
            if (error.message === "Email não encontrado") {
                return res.notFound(error.message);
            }
            return res.serverError(`Internal: ${error.message}`);
        }

        return res.ok();
    }

    return { handle };
}
