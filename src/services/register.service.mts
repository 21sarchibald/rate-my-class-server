import  userModel from '../models/user.model.mts'
import type { User } from "../models/types.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import { validator } from "../services/utils.mts";
import {UserSchema} from "../database/json-schema.ts"
import * as argon2 from "argon2";

async function register(name:string, username:string, email:string, password:string, major:string) {
    let user: User | null = null;
    const createdAt = new Date();
    const updatedAt = new Date();
    const userType: "Student" = "Student";
    validator(UserSchema, {
        name, 
        username,
        email,
        password,
        major,
        userType,
        createdAt,
        updatedAt
    })
    user = await userModel.getUserByEmail(email);
    if (user) throw new EntityNotFoundError({message: "The email is already in the system", statusCode: 409});
    password = await argon2.hash(password)
    const newSignUp = {
        name, 
        username,
        email,
        password,
        major,
        userType,
        createdAt,
        updatedAt
    }
    return userModel.createUser(newSignUp);
};

export default {
    register
}