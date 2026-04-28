import { GetTagsMethods } from "../../../use-cases/get-tags/interfaces/methods";
import { response } from "../interfaces/status-code";
import { HttpRequest, HttpResponse } from "../recipe/interfaces/http";

export function tagListController(getTags: GetTagsMethods) {
    async function handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const res = response();
        try {
            const tags = await getTags.run();
            return res.ok(tags);
        } catch (error) {
            return res.serverError(`Internal: ${error}`);
        }
    }
    return { handle };
}
