import mongodb from "../database/index.mjs";
import type { Course } from "./types.mts";
import { ObjectId } from "mongodb";

async function getCourseById(courseId: string): Promise<Course | null> {
    
    const data = (await mongodb.getDb().collection<Course>("classes").findOne({ _id: new ObjectId(courseId) }));
    return data;
}

async function getCourseByCode(courseCode: string): Promise<Course | null> {
    
    const data = (await mongodb.getDb().collection<Course>("classes").findOne({ courseCode: courseCode }));
    return data;
}

async function createCourse(newCourse: Course) {
    const result = await mongodb.getDb().collection<Course>("classs").insertOne(newCourse)
    return result
}

async function updateCourse(courseId: string, updates: Partial<Course>) {
    const result = await mongodb.getDb().collection<Course>("classes").updateOne(
        { _id: new ObjectId(courseId) },
        { $set: { updates }}
    )
    return result
}

async function deleteCourse(courseId: string) {
    if (!ObjectId.isValid(courseId)) {
        throw new Error("Invalid course ID")
    }

    const result = await mongodb.getDb().collection<Course>("classes").deleteOne({ _id: new ObjectId(courseId) })
    return result
}

export default {
    getCourseById,
    getCourseByCode,
    createCourse,
    updateCourse,
    deleteCourse
}