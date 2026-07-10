import type { JSONSchema7 } from "json-schema";

// This extends the library's type definition to include your custom keyword
declare module "json-schema" {
 export interface JSONSchema7 {
   instanceof?: string | string[];
 }
}

  // User schema
export const UserSchema: JSONSchema7 = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "User",
    description: "",
    type: "object",
    properties: {
        _id: { type: "string" },
        name: {
            type: "string",
            minLength: 2,
            maxLength: 50,
            description:
                "The name of the user, must be at least two characters long and no more than 50 characters long"
        },
        email: { type: "string", format: "email" },
        username: {
        type: "string",
        description: "Unique username chosen by the user"
        },
        password: {
            type: "string",
            minLength: 6,
            maxLength: 100,
            description:
                "The password of the user, must be at least six characters long and no more than one hundred characters long"
        },
        major: {
        type: "string",
        description: "The user's declared major"
        },
        userType: {
        type: "string",
        enum: ["Student", "Admin"],
        description: "The role of the user"
        },
        createdAt: { instanceof: "Date" },
        updatedAt: { instanceof: "Date" }

    },
    required: [
        "name",
        "email",
        "username",
        "password",
        "major",
        "userType",
        "createdAt",
        "updatedAt"
    ]

};
