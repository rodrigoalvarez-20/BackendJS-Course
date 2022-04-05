import { StatusCodes } from "http-status-codes";
import getMongoClient from "../utils/db.js";
import bcrypt from "bcrypt";


const getUserProfileMethod = (req, res) => {
    return res.status(StatusCodes.OK).json({ "message": "Respuesta desde users" });
}

const loginUserMethod = (req, res) => {

    //Mapear los datos del body

    return res.status(StatusCodes.OK).json({"token": "HolaSoyUnaToken"})
}

const registerUserMethod = (req, res) => {
    // Desctructuracion de parametros

    //const { llave, llave2, llave3, nombre_usuario } = req.query;
    
    const { nombre, last_name, email, password } = req.body;

    console.log(email);
    console.log(password);
    
    const pwdHsh = bcrypt.hashSync(password, 12);

    if(pwdHsh === null){
        //Except
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message": "Error al hashear password"});
    }

    console.log(pwdHsh);
    
    console.log("Antes del return"); // 1
    return res.status(StatusCodes.CREATED).json({"message": "Se ha registrado el usuario"})
}

const updateUserProfileMethod = (req, res) => {
    return res.status(StatusCodes.OK).json({ "message": "Se ha actualizado correctamente el perfil" })
}

const getAllClients = (req, res) => {
    //const mongoConn = getMongoClient();

    

};


export { getUserProfileMethod, loginUserMethod, registerUserMethod, updateUserProfileMethod }