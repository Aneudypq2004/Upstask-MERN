import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/generarId.js";
import generarJWT from "../helpers/generalJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/Email.js";

const registrar = async (req, res) => {

    const { email } = req.body

    const usuarioAlmacenado = await Usuario.findOne({ email });

    if (usuarioAlmacenado) {
        const error = new Error('El Usuario ya existe');
        return res.status(404).json({ msg: error.message })
    }

    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId()
        const usuarioAlmacenado = await usuario.save();
        res.json({ msg: "Usuario Creado Correctamente Revisa tu email" });
        emailRegistro({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        })

    } catch (error) {
        res.json({ msg: error.message })



    }
}

const autenticar = async (req, res) => {

    const { email, password } = req.body

    //Revisar que el usuario exists
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
        const error = new Error('El Usuario no exite');
        return res.status(404).json({ msg: error.message })
    }

    //Comprobar que el usario este confirmado


    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no hay sido confirmada');
        return res.status(404).json({ msg: error.message })
    }

    //Comprobar password

    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })

    } else {
        const error = new Error('Password Incorrecto');
        return res.status(404).json({ msg: error.message })

    }

}
const confirmar = async (req, res) => {

    const { token } = req.params

    //comprobar token
    const usuario = await Usuario.findOne({ token });

    if (!usuario) {
        const error = new Error('Token No valido');
        return res.status(404).json({ msg: error.message })
    }

    try {

        usuario.token = ''
        usuario.confirmado = true
        await usuario.save()
        res.status(200).json({ msg: "Cuenta confirmada correctamente" })

    } catch (error) {
        console.log(error)
    }

}

const olvidePassword = async (req, res) => {
    const { email } = req.body

    //Revisar que el usuario exists
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
        const error = new Error('El Usuario no exite');
        return res.status(404).json({ msg: error.message })
    }

    try {
        usuario.token = generarId();
        await usuario.save()
        res.json({ msg: "Hemos Enviado un email con las intrucciones" });

        emailOlvidePassword({

            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        })

    } catch (error) {
        console.log(error)

    }


}

const comprobarToken = async (req, res) => {

    const { token } = req.params;

    //comprobar token
    const tokenValido = await Usuario.findOne({ token });

    if (tokenValido) {
        res.json({ msg: "Token valido y el usuario existe" });

    } else {

        const error = new Error('Token No valido');
        return res.status(403).json({ msg: error.message });
    }
}
const nuevoPassword = async (req, res) => {

    const { password } = req.body

    const { token } = req.params;

    //comprobar token
    const usuario = await Usuario.findOne({ token });

    if (usuario) {
        usuario.password = password
        usuario.token = ''
        await usuario.save()
        res.json({msg : "Password Modificado Correctamente"})

    } else {
        const error = new Error('Token No valido');
        return res.status(404).json({ msg: error.message })
    }

}

const perfil = (req, res) => {

   res.json(req.usuario)
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}