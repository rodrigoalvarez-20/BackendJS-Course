
const NOMBRE = "Rodrigo";

import { StatusCodes } from "http-status-codes";

const usersGetMethod = (req, res) => {
    return res.status(StatusCodes.OK).json({ "message": "Respuesta desde users" });
}


export {  usersGetMethod, NOMBRE }