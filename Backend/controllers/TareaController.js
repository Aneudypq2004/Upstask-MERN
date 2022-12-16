import Tarea from "../models/Tareas.js";
import Proyecto from "../models/Proyectos.js";

const agregarTarea = async (req, res) => {

    const { proyecto } = req.body

    const existeProyecto = await Proyecto.findById(proyecto);


    if (!existeProyecto) {
        const error = new Error('El proyecto no existe');
        return res.status(404).json({ msg: error.message })
    }


    if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {

        const error = new Error('Accion no valida');
        return res.status(403).json({ msg: error.message })

    }

    try {
        const TareaAlmacenada = await Tarea.create(req.body);
        //Almacenar el id en el proyecto
        existeProyecto.tareas.push(TareaAlmacenada._id)

        await existeProyecto.save()

        res.json(TareaAlmacenada);
    } catch (error) {

    }
}

const obtenerTarea = async (req, res) => {

    const { id } = req.params

    const tarea = await Tarea.findById(id).populate('proyecto');

    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({ msg: error.message })

    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {

        const error = new Error('Accion no valida');
        return res.status(403).json({ msg: error.message })

    }

    res.json(tarea)

}

const actualizarTarea = async (req, res) => {
    const { id } = req.params

    const tarea = await Tarea.findById(id).populate('proyecto');

    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({ msg: error.message })

    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {

        const error = new Error('Accion no valida');
        return res.status(403).json({ msg: error.message })

    }
    tarea.nombre = req.body.nombre || tarea.nombre
    tarea.descripcion = req.body.descripcion || tarea.descripcion
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega
    tarea.prioridad = req.body.cliente || tarea.prioridad

    try {
        const TareaAlmacenada = await tarea.save();
        res.json(TareaAlmacenada)
    } catch (error) {

    }

}

const eliminarTarea = async (req, res) => {
    const { id } = req.params

    const tarea = await Tarea.findById(id).populate('proyecto');

    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({ msg: error.message })

    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {

        const error = new Error('Accion no valida');
        return res.status(403).json({ msg: error.message })
    }

    try {

        const proyecto = await Proyecto.findById(tarea.proyecto);
        proyecto.tareas.pull(tarea._id);
        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])

        res.json({ msg: "Eliminado Correctamente" });

    } catch (error) {

    }

}

const cambiarEstado = async (req, res) => {

    const { id } = req.params

    const tarea = await Tarea.findById(id).populate('proyecto');

    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({ msg: error.message })

    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString()
    )
    ) {
        const error = new Error('Accion no valida');
        return res.status(401).json({ msg: error.message })

    }

    try {

        tarea.estado = !tarea.estado;
        tarea.completado = req.usuario._id
        await tarea.save()

        const tareaAlmacenada = await Tarea.findById(id).populate('proyecto').populate('completado')


        return res.json(tareaAlmacenada)



    } catch (error) {
        console.log(error)


    }

}

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}