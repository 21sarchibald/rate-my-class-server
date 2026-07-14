import { Router } from "express";
import reviewService from "../services/review.service.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import { sanitize } from "../services/utils.mts";
import authorize from "../middleware/authorize.mts";
import type { CreateReviewRequest } from "../models/types.mts";
const router: Router = Router();

// GET /reviews?search=
router.get("/", async (req, res, next) => {
  // console.log(req.headers, req.body);
  try {

    const cleanQuery = sanitize(req.query) as { 
      search?: string,
      courseId: string,
      professor: string
    }
    console.log("params", cleanQuery);

    let reviewList;

    if (cleanQuery.search) {
      reviewList = await reviewService.searchReviews(cleanQuery.search);
    }

    else if (cleanQuery.courseId) {
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

// POST /reviews/create
router.post("/create", authorize, async (req, res, next) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", res.locals.user);
   const cleanBody = sanitize(req.body) as CreateReviewRequest;
   console.log("CLEAN BODY:", cleanBody);

   const user = res.locals.user;

   console.log("logged in user:", user);

   
   const newReview = await reviewService.createReview(cleanBody, user.userId)
   console.log("NEW REVIEW:", newReview);
  res.status(201).json({message:"Revew created successfully", reviewId: newReview.insertedId});

  } catch(err) {
    console.error("CREATE REVIEW ERROR:", err);
      next(err)
  }

});

export default router; // Export the router to use it in the main file
