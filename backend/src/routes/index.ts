import { Router } from "express";
import { env } from "../config/env.js";
import { adminRouter } from "./admin.routes.js";
import { contactController } from "../controllers/contact.controller.js";
import { createRateLimit } from "../middleware/rate-limit.js";
import { postDetailController, postsController } from "../controllers/post.controller.js";
import { profileController } from "../controllers/profile.controller.js";
import {
  projectDetailController,
  projectsController
} from "../controllers/project.controller.js";
import { resumeController } from "../controllers/resume.controller.js";
import { sendSuccess } from "../utils/api-response.js";

export const apiRouter = Router();
const contactRateLimit = createRateLimit({
  windowMs: env.CONTACT_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: env.CONTACT_RATE_LIMIT_MAX,
  message: "Too many contact attempts. Please try again later."
});

apiRouter.get("/health", (_req, res) => {
  sendSuccess(res, {
    service: "personal-website-backend",
    status: "ok"
  });
});

apiRouter.use("/admin", adminRouter);
apiRouter.get("/profile", profileController);
apiRouter.get("/projects", projectsController);
apiRouter.get("/projects/:slug", projectDetailController);
apiRouter.get("/posts", postsController);
apiRouter.get("/posts/:slug", postDetailController);
apiRouter.get("/resume", resumeController);
apiRouter.post("/contact", contactRateLimit, contactController);
