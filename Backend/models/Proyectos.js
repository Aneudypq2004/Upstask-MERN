import mongoose from "mongoose";

const ProyectosSchema = mongoose.Schema({

    nombre: {
        type: String,
        trm: true,
        required: true
    },

    descripcion: {
        type: String,
        trm: true,
        required: true
    },

    fechaEntrega: {
        type: Date,
        default: Date.now()
    },

    cliente: {
        type: String,
        trm: true,
        required: true
    },

    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },

    tareas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tarea'
        }
    ],

    colaboradores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }

    ],




},

    {
        timestamps: true
    }

)


const Proyecto = mongoose.model('Proyecto', ProyectosSchema);

export default Proyecto