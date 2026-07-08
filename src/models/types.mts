import { ObjectId } from "mongodb";

// User schema
export interface User {
    _id?: ObjectId;
    name: string;
    email: string;
    password: string;
    major: string;
    userType: "Admin" | "Student";
    createdAt: Date;
    modifiedAt: Date;
  }

// Course schema
export interface Course {
  _id?: ObjectId;
  courseCode: string;
  courseName: string;
  createdAt: Date;
  updatedAt: Date;
}