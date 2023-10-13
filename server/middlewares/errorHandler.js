import mongoose from "mongoose";

export const throw404 = (req, res, next) => {
  const newError = new Error("Resource not found");
  newError.status = 404;
  next(newError);
};

export const isValidId = (req) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new Error("The provided ID is not valid");
  }
};

export const handleErrors = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Server Error",
    },
  });
};
