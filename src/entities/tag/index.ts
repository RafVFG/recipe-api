import { Tag } from "./interfaces/tag";

export function tag(data: Tag) {
    function getValue(): Tag {
        return data;
    }
    return { getValue };
}
