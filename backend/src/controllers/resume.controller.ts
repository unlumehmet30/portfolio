import { getResume } from "../services/resume.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const resumeController = asyncHandler(async (_req, res) => {
  const resume = await getResume();
  sendSuccess(res, resume);
});
