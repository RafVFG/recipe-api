import { Tag } from "../../../entities/tag/interfaces/tag";

export interface GetTagsMethods {
    run(): Promise<Tag[]>
}
