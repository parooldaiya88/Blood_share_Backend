import { check, validationResult } from "express-validator";
//.optional(): This is a sanitization rule that marks the "name" field as optional. It means that if the "name" field is not present in the input data, it will not raise an error during the sanitization process. This is useful for fields that are not required.
const sanitizeInput = [
  check("name").optional().trim().escape(),
  check("age").optional().trim().escape(),
  check("email").optional().trim().escape().normalizeEmail(),
  check("password").optional().trim().escape(),
  check("address").optional().trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      next();
    } else {
      res.status(422).json({ errors: errors.array() });
    }
  },
];

export default sanitizeInput;
