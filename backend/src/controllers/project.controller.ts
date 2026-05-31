import { getProjectBySlug, getProjects } from "../services/project.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const projectsController = asyncHandler(async (_req, res) => {
  const projects = await getProjects();
  sendSuccess(res, projects);
});

export const projectDetailController = asyncHandler(async (req, res) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const project = await getProjectBySlug(slug);
  sendSuccess(res, project);
});
