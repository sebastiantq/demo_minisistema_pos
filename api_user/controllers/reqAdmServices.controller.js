const { response } = require("express");

const ReqAdmService = require("../models/reqAdmService");

const reqAdmServicesPost = async (req, res = response) => {
  const { email, ...body } = req.body;

  const name = body.name.toUpperCase();

  const reqAdmService = new ReqAdmService({ name, email });

  // Guardar en BD
  await reqAdmService.save();

  res.status(202).json({
    reqAdmService,
  });
};

module.exports = {
  reqAdmServicesPost,
};
