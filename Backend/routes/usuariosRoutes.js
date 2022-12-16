import express from "express";

import { autenticar, registrar, confirmar, olvidePassword,
    nuevoPassword,
    comprobarToken,
    perfil

} from "../controllers/UsuarioControllers.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

//Creacion , registro y confirmacion de Usuarios

router.post('/', registrar) //Crear un nuevo Usuario

router.post('/login',autenticar);

router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);
router.get('/perfil', checkAuth, perfil)



export default router;

