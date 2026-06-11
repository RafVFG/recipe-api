import { RegisterUserMethods } from "../../../use-cases/register-user/interfaces/methods";
import { response } from "../interfaces/status-code";
import { HttpRequest, HttpResponse } from "../recipe/interfaces/http";

export function registerController(registerUser: RegisterUserMethods) {
    async function handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const res = response();
        const name: string = httpRequest.body?.name ?? "";
        const email: string = httpRequest.body?.email ?? "";
        const password: string = httpRequest.body?.password ?? "";

        if (!name || name.trim() === "") return res.badRequest("Missing body: name");
        if (!email || !email.includes("@")) return res.badRequest("Missing body: email");
        if (!password || password.trim() === "") return res.badRequest("Missing body: password");

        try {
            await registerUser.run(name.trim(), email.trim(), password);
            return res.created();
        } catch (error: any) {
            if (error?.message === "Email já cadastrado") return res.conflict("Email já cadastrado");
            return res.serverError(`Internal: ${error}`);
        }
    }

    return { handle };
}
