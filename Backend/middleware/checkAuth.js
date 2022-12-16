import Usuario from "../models/Usuario.js";
import Jwt from "jsonwebtoken";

const checkAuth = async (req, res, next) => {

    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {

            token = req.headers.authorization.split(' ')[1];

            const decoded = Jwt.decode(token, process.env.PASS_JWT);

            req.usuario = await Usuario.findById(decoded.id).select(' -password -token -confirmado -createdAt -updatedAt -__v');

            return next()

        } catch (error) {
            return res.status(404).json({ msg: "Hubo un error" })

        }


    }

    if (!token) {
        const error = new Error('Token no valido');
        return res.status(401).json({ msg: error.message })
    }

    next()

}


export default checkAuth