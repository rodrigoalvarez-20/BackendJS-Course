import mongoose from "mongoose";
import ConfigParser from "configparser";

let cfg = new ConfigParser();

function getMongoClient(){
    cfg.read("../config.cfg");
    if (cfg.get("MONGO", "host") && cfg.get("MONGO", "user") && cfg.get("MONGO", "password")){
        const usr = cfg.get("MONGO", "user");
        const pwd = cfg.get("MONGO", "password");
        const host = cfg.get("MONGO", "host");

        const strMongoCon = `mongodb+srv://${usr}:${pwd}@${host}/myFirstDatabase?retryWrites=true&w=majority`;

        return mongoose.connect(strMongoCon);

    }else {
        console.log("Error en las secciones de configuracion");
    }
}

export default getMongoClient;