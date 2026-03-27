import { User } from "./interfaces/user";

export function user(data: User) {
    function getValue(): User {
        return data;
    }

    return { getValue };
}
