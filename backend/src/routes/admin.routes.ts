import { Router } from "express";
import { env } from "../config/env.js";
import {
  adminContactMessageDeleteController,
  adminContactMessageHandledController,
  adminContactMessagesController,
  adminLoginController,
  adminMeController,
  adminPostCreateController,
  adminPostDeleteController,
  adminPostsController,
  adminPostUpdateController,
  adminProfileController,
  adminProfileUpdateController,
  adminProjectImageUploadController,
  adminProjectCreateController,
  adminProjectDeleteController,
  adminProjectsController,
  adminProjectUpdateController,
  adminResumeController,
  adminResumeUpdateController
} from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/admin-auth.js";
import { projectImageUpload } from "../middleware/project-image-upload.js";
import { createRateLimit } from "../middleware/rate-limit.js";

export const adminRouter = Router();
adminRouter.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  next();
});

const adminLoginRateLimit = createRateLimit({
  windowMs: env.ADMIN_LOGIN_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: env.ADMIN_LOGIN_RATE_LIMIT_MAX,
  key: (req) => {
    const username =
      typeof req.body?.username === "string" ? req.body.username.trim().toLowerCase() : "unknown";
    return `${req.ip}:${username}`;
  },
  message: "Too many login attempts. Please wait and try again."
});
const adminApiRateLimit = createRateLimit({
  windowMs: env.ADMIN_API_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: env.ADMIN_API_RATE_LIMIT_MAX,
  message: "Too many admin API requests. Please slow down."
});

adminRouter.post("/login", adminLoginRateLimit, adminLoginController);
adminRouter.use(requireAdmin);
adminRouter.use(adminApiRateLimit);

adminRouter.get("/me", adminMeController);
adminRouter.get("/profile", adminProfileController);
adminRouter.put("/profile", adminProfileUpdateController);

adminRouter.get("/projects", adminProjectsController);
adminRouter.post("/projects", adminProjectCreateController);
adminRouter.put("/projects/:id", adminProjectUpdateController);
adminRouter.delete("/projects/:id", adminProjectDeleteController);
adminRouter.post(
  "/uploads/project-image",
  projectImageUpload.single("image"),
  adminProjectImageUploadController
);

adminRouter.get("/posts", adminPostsController);
adminRouter.post("/posts", adminPostCreateController);
adminRouter.put("/posts/:id", adminPostUpdateController);
adminRouter.delete("/posts/:id", adminPostDeleteController);

adminRouter.get("/contact-messages", adminContactMessagesController);
adminRouter.patch("/contact-messages/:id/handled", adminContactMessageHandledController);
adminRouter.delete("/contact-messages/:id", adminContactMessageDeleteController);

adminRouter.get("/resume", adminResumeController);
adminRouter.put("/resume", adminResumeUpdateController);
