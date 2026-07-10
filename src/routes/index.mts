import { Router } from "express";
// import userRoutes from "./user.routes.mts";
import reviewRoutes from "./review.routes.mts";
// import swaggerRoutes from "./swagger.routes.mts";
// import registrationRouts from "./user.routes.mts";
import registrationRoutes from "./user.routes.mts";

const router:Router = Router();

// The home page route
router.get("/", (req, res) => {
  res.json({ title: "API V1" });
});

// load reviews routes
router.use("/reviews", reviewRoutes);

// login routes
// router.use("/users", userRoutes);

// registration routes
router.use("/signup", registrationRoutes);

// router.use(swaggerRoutes);


export default router;
