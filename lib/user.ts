import { dbManager } from "./firebase"

export type User = {
    displayName: string,
    email: string,
    pfpUrl?: string,
    roles: string[],
    uid: string
}

export async function saveUser(user: User) {
    await dbManager.setDoc(['users', user.uid], user);
}