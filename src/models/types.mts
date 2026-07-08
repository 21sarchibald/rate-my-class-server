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

// Review schema
export interface Review {
  _id?: ObjectId;
  userId: ObjectId;
  courseId: ObjectId;
  rating: number;
  difficulty: number;
  likelihoodToRecommend: number;
  professor: string;
  semester: "Winter" | "Spring" | "Summer" | "Fall";
  year: number;
  type: "online" | "in-person" | "hybrid";
  isBlock: boolean;
  description: string;
  gradeReceived: "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "D-" | "F" | "P" | "W";
  likes: number;
  dislikes: number;
  createdAt: Date;
  modifiedAt: Date;
}