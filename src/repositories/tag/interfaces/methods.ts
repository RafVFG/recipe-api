import { Tag } from "../../../entities/tag/interfaces/tag";

export interface TagRepositoryMethods {
    findOrCreate(name: string, idUser: number): Promise<number>
    getAll(): Promise<Tag[]>
    deleteById(id: number, idUser: number): Promise<boolean>
}
