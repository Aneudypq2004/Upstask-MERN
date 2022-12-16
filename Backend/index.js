import conectarDb from "./config/ConectarDB.js";
import express from "express";
import dotenv from 'dotenv';
import cors from 'cors'
import UsuarioRoutes from "./routes/usuariosRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import TareaRoutes from "./routes/TareaRoutes.js";

//Instancia express
const app = express();

//habilitar que se pueda recibir la informacion typo json

app.use(express.json())


//Configurar dotenv para que busque el archivo
dotenv.config();
conectarDb();

//configurar CORS
const whiteList = [process.env.URL_FRONT];

const CorsOptions = {

    origin : function(origin, callback) {
        

        if(whiteList.includes(origin)) {

            //Puede consultar la API
            callback(null, true)
        } else {
            //No Esta Permitido
            callback(new Error('Error de Cors') );
        }
    }
}

app.use(cors(CorsOptions))

//routing

app.use('/api/usuarios', UsuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', TareaRoutes)





const port = process.env.PORT || 4000

const servidor = app.listen(port, () => {
    console.log('Funcionando el puerto')
})

//socket io

import { Server } from "socket.io";

const io = new Server(servidor, {
    pingTimeout : 60000,
    cors : {
        origin : process.env.URL_FRONT
    }

})


io.on("connection", (socket) => { 

    //Definir Los eventos

    socket.on('abrir proyecto', proyecto => {
        socket.join(proyecto)
    })

    socket.on('nueva tarea', tarea => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea agregada', tarea)
    })

    socket.on('eliminar tarea', tarea => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tarea eliminada', tarea)

        //to and in es igual
    })

    socket.on('actualizar tarea', tarea => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('tarea actualizada', tarea)
    })

    socket.on('cambiar estado', tarea => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('nuevo estado', tarea)
    })


})

