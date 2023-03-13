const { Router } = require("express");

const { check } = require("express-validator");

const { validateFields } = require("../middlewares");

const router = Router();

const {
  reqAdmServicesPost,
} = require("../controllers/reqAdmServices.controller");

router.post(
  "/",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El correo no es válido").isEmail(),
    validateFields,
  ],
  reqAdmServicesPost
);

module.exports = router;
