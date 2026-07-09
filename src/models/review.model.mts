import mongodb from "../database/index.mjs";
import type { Review } from "./types.mts";
import { ObjectId } from "mongodb";

async function getReviewById(reviewId: string): Promise<Review | null> {
    const data = (await mongodb.getDb().collection<Review>("reviews").findOne({ _id: new ObjectId(reviewId) }));
    return data;
}

async function getReviewsByUser(userId: string): Promise<Review[] | null> {
    
    const data = (await mongodb.getDb().collection<Review>("reviews").find({ userId: new ObjectId(userId) })).toArray();
    return data;
}

async function getReviewsByProfessor(professor: string): Promise<Review[] | null> {
    
    const data = (await mongodb.getDb().collection<Review>("reviews").find({ professor: { $regex: professor, $options: "i" } })).toArray();
    return data;
}

async function getReviewsByClass(courseId: string): Promise<Review[] | null> {
    
    const data = (await mongodb.getDb().collection<Review>("reviews").find({ courseId: new ObjectId(courseId) })).toArray();
    return data;
}

async function searchReviews(search: string): Promise<Review[] | null> {

    const data = (await mongodb.getDb().collection<Review>("reviews").find({
        $or: [
            { courseName: { $regex: search, $options: "i"}},
            { professor: { $regex: search, $options: "i"}}
        ]
    })).toArray();
    return data;
}

async function createReview(newReview: Review) {
    const result = await mongodb.getDb().collection<Review>("reviews").insertOne(newReview)
    return result
}

async function updateReview(ReviewId: string, updates: Partial<Review>) {
    const result = await mongodb.getDb().collection<Review>("reviews").updateOne(
        { _id: new ObjectId(ReviewId) },
        { $set: { updates }}
    )
    return result
}

async function deleteReview(ReviewId: string) {
    if (!ObjectId.isValid(ReviewId)) {
        throw new Error("Invalid Review ID")
    }

    const result = await mongodb.getDb().collection<Review>("reviews").deleteOne({ _id: new ObjectId(ReviewId) })
    return result
}

export default {
    getReviewById,
    getReviewsByUser,
    getReviewsByProfessor,
    getReviewsByClass,
    searchReviews,
    createReview,
    updateReview,
    deleteReview
}