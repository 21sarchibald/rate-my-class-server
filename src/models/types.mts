import { ObjectId } from "mongodb";

// User schema
export interface User {
    _id?: ObjectId;
    name: string;
    username: string;
    email: string;
    password: string;
    major: string;
    userType: "Admin" | "Student";
    createdAt: Date;
    updatedAt: Date;
  }

// Course schema
export interface Course {
  _id?: ObjectId;
  courseCode: string;
  courseName: string;
  createdAt: Date;
  updatedAt: Date;
}

// Review schema
export interface Review {
  _id?: ObjectId;
  userId: ObjectId;
  courseId: ObjectId;
  courseCode: string;
  courseName: string;
  rating: number;
  difficulty: number;
  recommend: boolean;
  professor: string;
  semester: "Winter" | "Spring" | "Summer" | "Fall";
  year: number;
  type: "online" | "in-person" | "hybrid";
  isBlock: boolean;
  description: string;
  gradeReceived: "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "D-" | "F" | "P" | "W";
  likes?: number;
  dislikes?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Create Review Request schema
export interface CreateReviewRequest {
  courseCode: string;
  courseName: string;
  professor: string;
  semester: "Winter" | "Spring" | "Summer" | "Fall";
  isBlock: boolean;
  year: number;
  rating: number;
  gradeReceived: "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "D-" | "F" | "P" | "W";
  difficulty: number;
  type: "online" | "in-person" | "hybrid";
  recommend: boolean;
  description: string;
}

export interface QueryParams {
  category?: string;
  q?:string;
  limit?: string;
  offset?: string;
  fields?: string;
}