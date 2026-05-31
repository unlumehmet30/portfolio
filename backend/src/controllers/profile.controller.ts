import { getProfile } from "../services/profile.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { HttpError } from "../utils/http-error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const profileController = asyncHandler(async (_req, res) => {
  const profile = await getProfile();

  if (!profile) {
    throw new HttpError("Profile has not been seeded", 404, "NOT_FOUND");
  }

  sendSuccess(res, profile);
});
