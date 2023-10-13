import { check, body, validationResult } from "express-validator";
const validateInput = [
  check("name")
    .if(body("name").exists())
    .notEmpty()
    .withMessage("Name is Required")
    .isLength({ min: 3, max: 50 })
    .withMessage("First name must be between 3 and 50 character"),
  check("age")
    .if(body("age").exists())
    .notEmpty()
    .withMessage("Age is Required")
    .isInt({ min: 18 })
    .withMessage("Age must be at least 18 years"),
  check("address")
    .if(body("address").exists())
    .notEmpty()
    .withMessage("Address is Required"),
  check("email")
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Invalid Email Address"),
  check("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  (req, res, next) => {
    const results = validationResult(req);
    results.isEmpty()
      ? next()
      : res.status(422).json({ errors: results.errors });
  },
];
export default validateInput;
