import { RequestPasswordResetMethods } from "../../../use-cases/request-password-reset/interfaces/methods";
import { response } from "../interfaces/status-code";
import { AuthHttpRequest, AuthHttpResponse } from "./interfaces/http";

export function forgotPasswordController(requestPasswordReset: RequestPasswordResetMethods) {
    async function handle(httpRequest: AuthHttpRequest): Promise<AuthHttpResponse> {
        const res = response();
        const email: string = httpRequest.body?.email ?? "";

        if (!email || !email.includes("@")) return res.badRequest("Missing body: email");

        await requestPasswordReset.run(email.trim());
        return res.ok({ message: "Se o e-mail estiver cadastrado, você receberá um link" });
    }

    return { handle };
}
