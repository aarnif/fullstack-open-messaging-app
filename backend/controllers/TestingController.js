import User from "../models/user.js";

import asyncHandler from "express-async-handler";

const resetDatabase = asyncHandler(async (req, res) => {
  await User.deleteMany({});

  res.status(204).end();
});

export default { resetDatabase };
