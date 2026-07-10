import { Router } from "express";
import reviewService from "../services/review.service.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import { sanitize } from "../services/utils.mts";
const router: Router = Router();

// GET /reviews?search=
router.get("/", async (req, res, next) => {
  // console.log(req.headers, req.body);
  try {

    const cleanQuery = sanitize(req.query) as { search?: string}
    console.log("params", cleanQuery);

    const search = cleanQuery.search;

    if (!search) {
        return next(new EntityNotFoundError({message : 'Search term required', code: 'ERR_VALID', statusCode : 400}))
    }
    const reviewList = await reviewService.searchReviews(search);

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
    
// GET /products/course/:courseId
router.get("/course/:id", async (req, res, next) => {
  
    const {id} = req.params;
    if (!id)  {
      return next(new EntityNotFoundError({message : 'Id required',code: 'ERR_VALID', statusCode : 400}))
    }
    const reviewList = await reviewService.getReviewsByClass(id);
    if (!reviewList) {
      return next(new EntityNotFoundError({message : `Reviews for course ${id} Not Found`,code: 'ERR_NF',
        statusCode : 404}))
    }
    res.status(200).json(reviewList);

});

// GET /reviews/professor/:professorName
router.get("/professor/:professorName", async (req, res, next) => {
  
    const {professorName} = req.params;
    if (!professorName)  {
      return next(new EntityNotFoundError({message : 'Professor name required',code: 'ERR_VALID', statusCode : 400}))
    }
    const reviewList = await reviewService.getReviewsByProfessor(professorName);
    if (!reviewList) {
      return next(new EntityNotFoundError({message : `Reviews for professor ${professorName} Not Found`,code: 'ERR_NF',
        statusCode : 404}))
    }
    res.status(200).json(reviewList);
  
});

export default router; // Export the router to use it in the main file
