const express = require("express");
const cors = require("cors");

const fileUpload = require("express-fileupload");

const { dbConnection } = require("../database/config.db");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      admServices: "/api/v1/admServices",
      reqAdmServices: "/api/v1/reqAdmServices",
      users: "/api/v1/users/",
      auth: "/api/v1/users/auth/",
      search: "/api/v1/search",
      uploads: "/api/v1/uploads",
      docs: "/api/v1/users/docs"
    };

    // Conectar a base de datos
    this.connectDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static("public"));

    // Cargar archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        createParentPath: true,
        tempFileDir: "/tmp/",
      })
    );
  }

  routes() {
    this.app.use(this.paths.users, require("../routes/users.routes"));
    this.app.use(
      this.paths.admServices,
      require("../routes/admServices.routes")
    );
    this.app.use(
      this.paths.reqAdmServices,
      require("../routes/reqAdmServices.routes")
    );
    this.app.use(this.paths.auth, require("../routes/auth.routes"));
    this.app.use(this.paths.search, require("../routes/search.routes"));
    this.app.use(this.paths.uploads, require("../routes/uploads.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
