import { DelTagMethods } from "../../../use-cases/del-tag/interfaces/methods";
import { response } from "../interfaces/status-code";
import { HttpRequest, HttpResponse } from "../recipe/interfaces/http";

export function tagDelController(delTag: DelTagMethods) {
    async function handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const res = response();
        const id = Number(httpRequest.params?.id);
        const userId = httpRequest.userId;

        if (!id) return res.badRequest("Missing params: id");
        if (!userId) return res.unauthorized("Unauthorized");

        try {
            await delTag.run(id, userId);
            return res.ok();
        } catch (error) {
            if ((error as Error).message === "Tag não encontrada ou sem permissão") {
                return res.notFound((error as Error).message);
            }
            return res.serverError(`Internal: ${error}`);
        }
    }
    return { handle };
}
