import User from "../models/User.js";

// @route   GET /api/users
// @desc    Get all users (excluding the requester), optional ?search=
export const getUsers = async (req, res, next) => {
  try {
    const { search } = req.query;

    const query = { _id: { $ne: req.user._id } };

    if (search && search.trim()) {
      query.username = { $regex: search.trim(), $options: "i" };
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ isOnline: -1, username: 1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};
