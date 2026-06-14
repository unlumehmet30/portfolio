import {
  adminCreatePost,
  adminCreateProject,
  adminDeleteContactMessage,
  adminDeletePost,
  adminDeleteProject,
  adminGetProfile,
  adminGetResume,
  adminListContactMessages,
  adminListPosts,
  adminListProjects,
  adminMarkContactMessageHandled,
  adminUpdatePost,
  adminUpdateProfile,
  adminUpdateProject,
  adminUpdateResume,
  loginAdmin
} from "../services/admin.service.js";
import { postFileUploadUrl, postUploadUrl, projectUploadUrl } from "../config/uploads.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";

function parseId(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number(raw);

  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError("Invalid id parameter", 400, "BAD_REQUEST");
  }

  return id;
}

export const adminLoginController = asyncHandler(async (req, res) => {
  const session = await loginAdmin(req.body);
  sendSuccess(res, session);
});

export const adminMeController = asyncHandler(async (_req, res) => {
  sendSuccess(res, {
    user: res.locals.admin
  });
});

export const adminProfileController = asyncHandler(async (_req, res) => {
  const profile = await adminGetProfile();
  sendSuccess(res, profile);
});

export const adminProfileUpdateController = asyncHandler(async (req, res) => {
  const profile = await adminUpdateProfile(req.body);
  sendSuccess(res, profile);
});

export const adminProjectsController = asyncHandler(async (_req, res) => {
  const projects = await adminListProjects();
  sendSuccess(res, projects);
});

export const adminProjectCreateController = asyncHandler(async (req, res) => {
  const project = await adminCreateProject(req.body);
  sendSuccess(res, project, 201);
});

export const adminProjectUpdateController = asyncHandler(async (req, res) => {
  const project = await adminUpdateProject(parseId(req.params.id), req.body);
  sendSuccess(res, project);
});

export const adminProjectDeleteController = asyncHandler(async (req, res) => {
  const result = await adminDeleteProject(parseId(req.params.id));
  sendSuccess(res, result);
});

export const adminProjectImageUploadController = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new HttpError("Project image file is required", 400, "BAD_REQUEST");
  }

  sendSuccess(res, {
    imageUrl: projectUploadUrl(req.file.filename)
  }, 201);
});

export const adminPostImageUploadController = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new HttpError("Post image file is required", 400, "BAD_REQUEST");
  }

  sendSuccess(res, {
    imageUrl: postUploadUrl(req.file.filename)
  }, 201);
});

export const adminPostFileUploadController = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new HttpError("Post file is required", 400, "BAD_REQUEST");
  }

  const fileType = req.file.mimetype === "application/pdf" ? "pdf" : "html";
  const title = req.file.originalname.replace(/\.[^.]+$/, "") || "Note file";
  const markdown =
    typeof res.locals.postFileMarkdown === "string" && res.locals.postFileMarkdown.trim()
      ? res.locals.postFileMarkdown.trim()
      : undefined;

  sendSuccess(res, {
    file: {
      title,
      url: postFileUploadUrl(req.file.filename),
      fileType,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size
    },
    markdown
  }, 201);
});

export const adminPostsController = asyncHandler(async (_req, res) => {
  const posts = await adminListPosts();
  sendSuccess(res, posts);
});

export const adminPostCreateController = asyncHandler(async (req, res) => {
  const post = await adminCreatePost(req.body);
  sendSuccess(res, post, 201);
});

export const adminPostUpdateController = asyncHandler(async (req, res) => {
  const post = await adminUpdatePost(parseId(req.params.id), req.body);
  sendSuccess(res, post);
});

export const adminPostDeleteController = asyncHandler(async (req, res) => {
  const result = await adminDeletePost(parseId(req.params.id));
  sendSuccess(res, result);
});

export const adminContactMessagesController = asyncHandler(async (_req, res) => {
  const messages = await adminListContactMessages();
  sendSuccess(res, messages);
});

export const adminContactMessageDeleteController = asyncHandler(async (req, res) => {
  const result = await adminDeleteContactMessage(parseId(req.params.id));
  sendSuccess(res, result);
});

export const adminContactMessageHandledController = asyncHandler(async (req, res) => {
  const message = await adminMarkContactMessageHandled(parseId(req.params.id));
  sendSuccess(res, message);
});

export const adminResumeController = asyncHandler(async (_req, res) => {
  const resume = await adminGetResume();
  sendSuccess(res, resume);
});

export const adminResumeUpdateController = asyncHandler(async (req, res) => {
  const resume = await adminUpdateResume(req.body);
  sendSuccess(res, resume);
});
