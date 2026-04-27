import { tagRepository } from "../../repositories/tag";
import { delTag } from "../../use-cases/del-tag";
import { tagDelController } from "../controllers/tag/del";

export function makeDelTag() {
    const repository = tagRepository();
    const useCase = delTag(repository);
    return tagDelController(useCase);
}
