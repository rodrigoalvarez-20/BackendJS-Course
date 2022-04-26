
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import fs from "fs";

const auth_user = (req, res, next) => {
    try {
        const token = req.headers.authorization || req.headers["Authorization"];

        const pubKey = fs.readFileSync(`${process.cwd()}/keys/public.pem`, "utf-8");

        const decode = jwt.verify(token, pubKey);

        req.payload = decode;

        next();
    } catch (ex) {
        console.log(ex.message);
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Autenticacion fallida" });
    }
}


export { auth_user };