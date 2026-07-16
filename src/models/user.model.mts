import mongodb from "../database/index.mts";
import type { User } from "./types.mts";
import { ObjectId } from "mongodb";

async function getUserById(userId: string): Promise<User | null> {
    
    const data = (await mongodb.getDb().collection<User>("users").findOne({ _id: new ObjectId(userId) }));
    return data;
}

async function getUserByEmail(email: string): Promise<User | null> {
    
    const data = (await mongodb.getDb().collection<User>("users").findOne({ email: email }));
    return data;
}

async function getUserByUsername(username: string): Promise<User | null> {
    
    const data = (await mongodb.getDb().collection<User>("users").findOne({ username: username }));
    return data;
}

async function createUser(newUser: User) {
    const result = await mongodb.getDb().collection<User>("users").insertOne(newUser)
    return result
}

async function updateUser(userId: string, updates: Partial<User>) {
    const result = await mongodb.getDb().collection<User>("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { updates }}
    )
    return result
}

async function deleteUser(userId: string) {
    if (!ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID")
    }

    const result = await mongodb.getDb().collection<User>("users").deleteOne({ _id: new ObjectId(userId) })
    return result
}

export default {
    getUserById,
    getUserByEmail,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser
}
