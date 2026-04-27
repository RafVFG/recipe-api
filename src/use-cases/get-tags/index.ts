import { TagRepositoryMethods } from "../../repositories/tag/interfaces/methods";
import { GetTagsMethods } from "./interfaces/methods";

export function getTags(tagRepository: TagRepositoryMethods): GetTagsMethods {
    async function run() {
        return tagRepository.getAll();
    }
    return { run };
}
