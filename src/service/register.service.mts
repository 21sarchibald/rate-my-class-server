import type User from "../models/types.mjs";
import { userModel } from '../models/user.model.mts'
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";


async function register(name:string, username:string, major:string, email:string, password:string) {
    let user: User | null = null;
    user = await userModel.getUserByEmail(email);
    if (user) throw new EntityNotFoundError({message: "The email is already in the system", statusCode: 409});

}