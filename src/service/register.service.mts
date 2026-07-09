import  userModel from '../models/user.model.mjs'
import type { User } from "../models/types.mjs";
import EntityNotFoundError from "../errors/EntityNotFoundError.mjs";
import { validator } from "./utils.mjs";
import {UserSchema} from "../database/json-schema.js"

async function register(name:string, username:string, major:string, email:string, password:string, userType: "Student", createdAt: Date, modifiedAt: Date) {
    let user: User | null = null;
    user = await userModel.getUserByEmail(email);
    if (user) throw new EntityNotFoundError({message: "The email is already in the system", statusCode: 409});
    const newSignUp = {
        name, 
        username,
        email,
        password,
        major,
        userType,
        createdAt,
        modifiedAt
    }
    validator(UserSchema, newSignUp)
    return userModel.createUser(newSignUp);
};

export default {
    register
}