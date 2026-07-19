import type { QueryParams, User } from "../models/types.mts";
import jwt from "jsonwebtoken";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import type { SignOptions } from "jsonwebtoken";
import Ajv from "ajv";
import addFormats from "ajv-formats"
import addKeywords from "ajv-keywords"
import type { JSONSchema7 } from "json-schema"

export function validator(schema:JSONSchema7 , data:Object) {
  // for some reason typescript doesn't like this even though it is exactly how the documentation says to use these. We are just going to ignore the types for now 🤷🏻‍♂️
  // @ts-ignore
  const ajv = new Ajv();
  // @ts-ignore
  addFormats(ajv);
  // @ts-ignore
  addKeywords(ajv, "instanceof"); 
  const validate = ajv.compile(schema)
  if(!validate(data)) {
      if(validate.errors) {
          // validate.errors is an array.  I've never seen more than one error come back...but just in case we can map over it and pull out the message(s)
          // We need to do this because our errorHandler is expecting a string...not an array of objects.
          const message = validate.errors.map((error:any)=> error.instancePath+" "+error.message).join(", ");
          throw new EntityNotFoundError({message:message, statusCode:400 });
      }
  }
}
 
 
export function sanitize(v:Record<string, any>) {
  if (typeof v === "object") {
      for (var key in v) {
        if (/^\$/.test(key) ) {
          delete v[key];
        } else {
          sanitize(v[key]);
        }
      }
    }
    return v;
};

export function generateToken(user: User) {
    const token = process.env.JWT_SECRET || "secret";
    const expiration = (process.env.JWT_EXPIRES_IN || "30m") as SignOptions["expiresIn"];

    const jwtUser = {
        id: user._id,
        email: user.email,
        userType: user.userType
    };

    return jwt.sign(jwtUser, token, { expiresIn: expiration });
}