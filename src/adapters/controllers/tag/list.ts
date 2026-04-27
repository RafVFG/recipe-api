import { GetTagsMethods } from "../../../use-cases/get-tags/interfaces/methods";
import { response } from "../interfaces/status-code";
import { TagHttpRequest, TagHttpResponse } from "./interfaces/http";

export function tagListController(getTags: GetTagsMethods) {
    async function handle(httpRequest: TagHttpRequest): Promise<TagHttpResponse> {
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
