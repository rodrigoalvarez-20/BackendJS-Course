import ConfigParser from "configparser";

const cfg = new ConfigParser();

function getMongoCreds(){
    
    cfg.read(`${process.cwd()}/config.cfg`);

    if (cfg.get("MONGO", "host") && cfg.get("MONGO", "user") && cfg.get("MONGO", "password")){
        const user = cfg.get("MONGO", "user");
        const pwd = cfg.get("MONGO", "password");
        const host = cfg.get("MONGO", "host");

        return { user, pwd, host }

        /**
         * {
         *  "user": user,
         *  "pwd": pwd,
         *  "host": host
         * }
         */
    }else {
        console.log("Los valores de configuracion no existen");
        return { "user": null, "pwd": null, "host": null }
    }
}

export { getMongoCreds }