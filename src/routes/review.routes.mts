import { Router } from "express";
import reviewService from "../services/review.service.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import { sanitize } from "../services/utils.mts";
import authorize from "../middleware/authorize.mts";
import type { CreateReviewRequest } from "../models/types.mts";
const router: Router = Router();

// GET /reviews?search=
router.get("/", async (req, res, next) => {
  try {

    const cleanQuery = sanitize(req.query) as { 
      // search?: string,
      courseId: string,
      professor: string
    }

    let reviewList;

    // if (cleanQuery.search) {
    //   reviewList = await reviewService.searchReviews(cleanQuery.search);
    // }

    if (cleanQuery.courseId) {
      reviewList = await reviewService.getReviewsByClass(cleanQuery.courseId);
    }

    else if (cleanQuery.professor) {
      reviewList = await reviewService.getReviewsByProfessor(cleanQuery.professor);
    }

    else {
      return next(new EntityNotFoundError({message : 'Search term required', code: 'ERR_VALID', statusCode : 400}))
    }

    if (!reviewList || reviewList.length === 0) {
        return next(new EntityNotFoundError({
          message : 'Reviews Not Found',
          code: 'ERR_NF',
          statusCode : 404}))
    }  
    res.status(200).json(reviewList);

    } catch (error) {
      next(error);
    }
    });

// GET /reviews/search?query=
router.get("/search", async (req, res, next) => {
  try {

    const cleanQuery = sanitize(req.query) as { 
      query?: string,
    }

    let results;

    if (cleanQuery.query) {
      results = await reviewService.searchReviews(cleanQuery.query);
    }

    else {
      return next(new EntityNotFoundError({message : 'Search query required', code: 'ERR_VALID', statusCode : 400}))
    }

    res.status(200).json(results);

    } catch (error) {
      console.error("Search Error:", error);
      next(error);
    }
    });

// POST /reviews/create
router.post("/create", authorize, async (req, res, next) => {
  try {
   const cleanBody = sanitize(req.body) as CreateReviewRequest;

   const user = res.locals.user;

   console.log("logged in user:", user);

   
   const newReview = await reviewService.createReview(cleanBody, user.id)
   console.log("NEW REVIEW:", newReview);
  res.status(201).json({message:"Revew created successfully", reviewId: newReview.insertedId});

  } catch(err) {
    console.error("CREATE REVIEW ERROR:", err);
      next(err)
  }

});

router.get("/:id", async (req, res, next) => {
  const {id} = req.params;
  if (!id) {
    return next(new EntityNotFoundError({message : 'Review id not found', code: 'ERR_VALID', statusCode: 400}))
  }
  const review = await reviewService.getReviewById(id);
  if (!review) {
    return next (new EntityNotFoundError({message : `Reviews for id ${id} Not Found`, code: 'ERR_NF', statusCode : 404}))
  }
  res.status(200).json(review);
});

router.put("/:id", authorize, async (req, res, next) => {
  try {
    const {id} = req.params as {id:string};
    if (!id) {
      return next(new EntityNotFoundError({message : 'Review id not found', code: 'ERR_VALID', statusCode: 400}))
    }
    const existingReview = await reviewService.getReviewById(id);
    if (!existingReview) {
      return next(new EntityNotFoundError({message : 'Existing Review not found', code: 'ERR_NF', statusCode: 404}))
    }
    const currentUser = res.locals.user;
    const reviewCreator = existingReview.userId;
    if (currentUser.id !== String(reviewCreator)) {
      return next(new EntityNotFoundError({message : 'User not authorized to edit review', code: 'ERR_VALID', statusCode: 403}))
    }

    const cleanBody = sanitize(req.body) as {
      rating: number;
      difficulty: number;
      recommend: boolean;
      professor: string;
      semester: "Winter" | "Spring" | "Summer" | "Fall";
      year: number;
      type: "online" | "in-person" | "hybrid";
      isBlock: boolean;
      description: string;
      gradeReceived: "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "D-" | "F" | "P" | "W" };
    const updateReviewCall = await reviewService.updateReview(id, cleanBody);
    if (updateReviewCall.matchedCount === 0) {
      return next(new EntityNotFoundError({message : 'Review not updated', code: 'ERR_NF', statusCode: 404}))
    }
    const review = await reviewService.getReviewById(id);
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
});

export default router; // Export the router to use it in the main file
