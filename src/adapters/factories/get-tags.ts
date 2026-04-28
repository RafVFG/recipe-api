import { tagRepository } from "../../repositories/tag";
import { getTags } from "../../use-cases/get-tags";
import { tagListController } from "../controllers/tag/list";

export function makeGetTags() {
    const repository = tagRepository();
    const useCase = getTags(repository);
    const controller = tagListController(useCase);
    return controller;
}
