import { TagRepositoryMethods } from "../../repositories/tag/interfaces/methods";
import { DelTagMethods } from "./interfaces/methods";

export function delTag(tagRepository: TagRepositoryMethods): DelTagMethods {
    async function run(id: number, idUser: number): Promise<void> {
        const deleted = await tagRepository.deleteById(id, idUser);
        if (!deleted) throw new Error("Tag não encontrada ou sem permissão");
    }
    return { run };
}
