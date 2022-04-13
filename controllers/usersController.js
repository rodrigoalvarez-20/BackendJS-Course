import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import user from "../models/user.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import fs from "fs";

/**
 * 1. Restringir el acceso a esta ruta
 * 2. Validar la token
 * 3. Obtener los datos de la token (_id) para hacer la peticion a la BD
 * 4. Regresarle la informacion del perfil al usuario
 */

const getUserProfileMethod = (req, res) => {

    const { authorization } = req.headers;

    //const auth_header = req.headers["authorization"]; Manera alternativa (si no se quiere utilizar destrucuracion de parametros)

    if(!authorization){
        return res.status(StatusCodes.BAD_REQUEST).json({ "error": "Encabezado no encontrado" });
    }

    const pubKey =  fs.readFileSync(`${process.cwd()}/keys/public.pem`, "utf-8");

    try {
        
        const jwtData = jwt.verify(authorization, pubKey);

        const { id } = jwtData; //Destructuracion de parametros

        user.findById(id, {"_id": 0, "password": 0, "__v": 0}).exec().then(usr_find => {

            if(!usr_find){
                //No se encontró el usuario
                return res.status(StatusCodes.NOT_FOUND).json({ "error": "El usuario no existe" });
            }

            return res.status(StatusCodes.OK).json(usr_find);

        }).catch(usrError => {
            console.log(usrError);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al obtener los datos" });
        });
    } catch (validateError)  {
        console.log(validateError);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al validar la token" });
    }
}

const loginUserMethod = (req, res) => {
    //Mapear los datos del body
    /**
     *  1. Validar el email
     *  2. Validar el password
     *  3. Generar una token
     *  4. Regresar la token y la informacion del usuario
     */

    // SELECT * FROM users WHERE email = "";
    // SELECT name, last_name, email, password FROM users WHERE email = "";

    const { email, password } = req.body;

    // user.find() --> Lista de documentos
    // user.findOne({}) --> El documento que haga match con el parametro
    // user.findById("") --> El documento que haga match con el _id    
    user.findOne({ email }, { "__v": 0 }).exec().then(user_found => {
        if (user_found === null) {
            return res.status(StatusCodes.BAD_REQUEST).json({ "error": "Las credenciales son incorrectas" });
        }

        const { _id, name } = user_found;
        const pwd_hsh = user_found["password"];


        if (!bcrypt.compareSync(password, pwd_hsh)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ "error": "Las credenciales son incorrectas" });
        }

        // Generar una token

        const token_payload = {
            name,
            email,
            "id": _id
        }

        // 1. Leer la llave privada
        // 1.1 Obtener la ruta de ejecucion
        // 1.2 Leer el archivo private.key
        // 2. Especificar el algoritmo
        // 3. Generar la token
        
        const pKey = fs.readFileSync(`${process.cwd()}/keys/private.key`, "utf-8"); // Obtener la ruta de ejecucion y leer el archivo


        const token = jwt.sign(token_payload, pKey, {
            "algorithm": "RS256",
            "expiresIn": "6h"
        });

        if (!token) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al generar la token" })
        }

        return res.status(StatusCodes.OK).json({ "message": "Inicio de sesion correcto", token });


    }).catch(usrError => {
        console.log(usrError);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al solicitar los datos de usuario en la BD" })
    });
    //return res.status(StatusCodes.OK).json({"token": "HolaSoyUnaToken"})
}

/**
     * 1. Pedirle los datos al usuario (cliente) Listo
     * 2. Verificar que los datos recibidos sean válidos LISTO
     * 3. Verificar que no exista algun usuario con el email que estamos mandando LISTO
     * 4. Hashear el password del usuario (Verificar el hash) LISTO
     * 5. Agregamos nuestro nuevo usuario
     * 6. Validamos que la insercion haya sido correcta
     * 7. Regresamos un codigo de estado al usuario
     */

const registerUserMethod = (req, res) => {
    // Desctructuracion de parametros
    const { name, last_name = "", email, password } = req.body;

    if (name === "" || email === "" || password === "") {
        return res.status(StatusCodes.BAD_REQUEST).json({ "error": "Los parametros no pueden estar vacíos" })
    }
    const query_param = { email }

    user.findOne(query_param).exec().then(user_in_db => {
        if (user_in_db !== null) {
            console.log(user_in_db);
            return res.status(StatusCodes.BAD_REQUEST).json({ "error": "El email ya se encuentra registrado" })
        }
        const pwdHsh = bcrypt.hashSync(password, 12);

        if (pwdHsh === null) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al hashear el password" })
        }

        const user_to_insert = new user({
            "_id": mongoose.Types.ObjectId(),
            name,
            last_name,
            email,
            "password": pwdHsh,
            "createdAt": new Date().toISOString()
        });

        user_to_insert.save().then(usr_ins => {
            if(usr_ins === null){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al insertar el usuario" })
            }
            console.log(`Inserted DOC: ${usr_ins}`);
            return res.status(StatusCodes.CREATED).json({ "message": "Se ha creado el usuario", "_id": usr_ins["_id"] });
        }).catch(errorIns => {
            console.log(errorIns);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al crear el usuario" })
        });

    }).catch(error => {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al solicitar los datos de usuario en la BD" })
    });

}

const updateUserProfileMethod = (req, res) => {
    return res.status(StatusCodes.OK).json({ "message": "Se ha actualizado correctamente el perfil" })
}

const getAllClients = (req, res) => {
    //const mongoConn = getMongoClient();
};


export { getUserProfileMethod, loginUserMethod, registerUserMethod, updateUserProfileMethod }