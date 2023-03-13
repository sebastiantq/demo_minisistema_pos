const { Schema, model } = require("mongoose");

const ReqAdmServiceSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: false,
  },
});

// Se excluyen parametros JSON, sólo son necesarios en la DB
ReqAdmServiceSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

module.exports = model("ReqAdmService", ReqAdmServiceSchema);
