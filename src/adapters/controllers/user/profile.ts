import { GetUserProfileMethods } from "../../../use-cases/get-user-profile/interfaces/methods";
import { response } from "../interfaces/status-code";
import { HttpRequest, HttpResponse } from "../recipe/interfaces/http";

export function userProfileController(getUserProfile: GetUserProfileMethods) {
    async function handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const res = response();
        const userId = httpRequest.userId;
        if (!userId) return res.unauthorized("Unauthorized");
        try {
            const profile = await getUserProfile.run(userId);
            return res.ok(profile);
        } catch (error: any) {
            if (error?.message === "Usuário não encontrado") return res.notFound("Usuário não encontrado");
            return res.serverError(`Internal: ${error}`);
        }
    }
    return { handle };
}
