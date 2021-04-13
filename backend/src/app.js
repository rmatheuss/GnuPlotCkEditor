require("dotenv").config();

const express = require("express");
const cors = require('cors');
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path")

class AppController {
    constructor() {
        this.express = express();
    
        this.middlewares();
        this.routes();
      }

      middlewares() {
        mongoose.connect(
            process.env.MONGODB_CONNECTION_STRING,
        
            {
                useNewUrlParser: true,    
                useUnifiedTopology: true    
            }
        );

        this.express.use(cors())
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(morgan("dev"));
        this.express.use(
            "/files", 
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );

      }
    
      routes() {
        this.express.use(require("./routes"));
      }
}

module.exports = new AppController().express;