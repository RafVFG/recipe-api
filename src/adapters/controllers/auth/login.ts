import { LoginMethods } from "../../../use-cases/login/interfaces/methods";
import { response } from "../interfaces/status-code";
import { AuthHttpRequest, AuthHttpResponse } from "./interfaces/http";

export function loginController(login: LoginMethods) {
    async function handle(httpRequest: AuthHttpRequest): Promise<AuthHttpResponse> {
        const res = response();
        const email: string = httpRequest.body?.email ?? "";
        const password: string = httpRequest.body?.password ?? "";

        if (!email || !email.includes("@")) return res.badRequest("Missing body: email");
        if (!password) return res.badRequest("Missing body: password");

        try {
            const result = await login.run(email.trim(), password);
            return res.ok(result);
        } catch (error: any) {
            if (error?.message === "Email ou senha inválidos") return res.unauthorized("Email ou senha inválidos");
            return res.serverError(`Internal: ${error}`);
        }
    }

    return { handle };
}
