import { createContext } from "react";
import { useState, useEffect } from "react";
import clientesAxios from "../config/clienteAxios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import io from 'socket.io-client'

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
    const [alerta, setAlerta] = useState({});
    const [proyectos, setProyectos] = useState([]);
    const [proyecto, setProyecto] = useState([]);
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false);
    const [tarea, setTarea] = useState('');
    const [colaborador, setColaborador] = useState({});
    const [buscador, setBuscador] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        const obtenerProyectos = async () => {

            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clientesAxios('/proyectos', config);

            setProyectos(data)

        }

        obtenerProyectos()
    }, [])


    // Obtener Proyecto

    useEffect(() => {

        socket = io(import.meta.env.VITE_BACK_URL)

    }, []

    )

    const obtenerProyecto = async (id) => {

        setCargando(true)

        try {

            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientesAxios(`/proyectos/${id}`, config);

            setProyecto(data)

        } catch (error) {

            navigate('/proyectos')

        } finally {
            setCargando(false)
        }

    }

    const submitProyecto = async proyecto => {

        if (proyecto.id) {
            await editarProyecto(proyecto)
        } else {
            await nuevoProyecto(proyecto)
        }
    }

    //Actualizar

    const editarProyecto = async proyecto => {

        try {
            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientesAxios.put(`/proyectos/${proyecto.id}`, proyecto, config);

            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id ===
                data._id ? data : proyectoState)

            setProyectos(proyectosActualizados)

            setAlerta({ msg: "Proyecto Actualizado Correctamente", error: false })

            setTimeout(() => {
                setAlerta({})
                navigate("/proyectos")
            }, 3000);

        } catch (error) {

        }
    }

    //Nueovo Proyecto

    const nuevoProyecto = async proyecto => {

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        const { data } = await clientesAxios.post('/proyectos', proyecto, config);

        setProyectos([...proyectos, data])

        toast.success('Proyecto Creado Correctamente')

        setTimeout(() => {
            setAlerta({})
            navigate("/proyectos")
        }, 3000);


    }

    //Elimnar Proyecto
    const eliminarProyecto = async id => {

        try {
            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientesAxios.delete(`/proyectos/${id}`, config);

            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState.id !== id);
            setProyectos(proyectosActualizados)

            setAlerta({ msg: data.msg, error: false })

            setTimeout(() => {
                setAlerta({})
                navigate("/proyectos")
            }, 3000);

        } catch (error) {

        }
    }
    //cambiar el state del modal

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async (tarea) => {

        if (tarea?.id) {

            editarTarea(tarea)

        } else {
            CrearTarea(tarea)
        }
    }

    // Crear Tarea 

    const CrearTarea = async tarea => {
        try {

            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientesAxios.post('/tareas', tarea, config)

            //agregar tarea al state
            setAlerta({})
            setModalFormularioTarea(false)

            //Socket IO

            socket.emit('nueva tarea', data);

        } catch (error) {
            console.log(error)

        }

        setTimeout(() => {
            setAlerta({})
        }, 5000);

    }

    const editarTarea = async tarea => {
        try {

            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientesAxios.put(`/tareas/${tarea.id}`, tarea, config);


            //Socket IO

            socket.emit('actualizar tarea' , data)

            setAlerta({})
            setModalFormularioTarea(false)
            toast.success('Actualizado correctamente')


        } catch (error) {
            console.log(error)

        }

        setTimeout(() => {
            setAlerta({})
        }, 5000);

    }

    const handleModalEditarTarea = tarea => {
        setAlerta({})
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

    const handleModalEliminarTarea = tarea => {
        setAlerta({})
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async tarea => {
        try {

            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientesAxios.delete(`/tareas/${tarea._id}`, config);

            socket.emit('eliminar tarea',  tarea)
            setModalEliminarTarea(false)
            setTarea({})  
            toast.success(data.msg)   

        } catch (error) {
            console.log(error)

        }
    }


    const submitColaborador = async email => {
        setCargando(true)

        try {
            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientesAxios.post(`/proyectos/colaboradores`, email, config);
            setColaborador(data)
            setAlerta({})

        } catch (error) {

            setAlerta({
                msg: error.response.data.msg,
                error: true
            })

        }

        setCargando(false)

    }

    const agregarColaborador = async email => {
        setAlerta({})

        try {
            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientesAxios.post(`/proyectos/agregar-colaboradores/${proyecto._id}`, email, config);
            setAlerta({ msg: data.msg, error: false })
            setColaborador({})

            setTimeout(() => {
                setAlerta({})
            }, 5000);

        } catch (error) {

            setAlerta({
                msg: error.response.data.msg,
                error: true
            })

            setTimeout(() => {
                setAlerta({})
            }, 5000);

        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)

    }

    const eliminarColaborador = async () => {

        try {

            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientesAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config);

            const proyectoActuaizado = { ...proyecto }

            proyectoActuaizado.colaboradores = proyectoActuaizado.colaboradores.filter(colaboradorState =>
                colaboradorState._id !== colaborador._id);

            setAlerta({ msg: data.msg, error: false });

            setProyecto(proyectoActuaizado);

            setModalEliminarColaborador(false);

            setColaborador({});

            setTimeout(() => {
                setAlerta({})
            }, 5000);

        } catch (error) {

        }

    }


    const completarTarea = async id => {

        try {
            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientesAxios.post(`/tareas/estado/${id}`, {}, config);

            socket.emit('cambiar estado', data)
            setTarea({})


        } catch (error) {

        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    //Socket IO

    const submitTareasProyecto = tarea => {

        const proyectoActualizado = { ...proyecto };
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];
        setProyecto(proyectoActualizado);
    }

    const eliminarTareaProyecto = tarea => {
        const proyectoActualizado = { ...proyecto };
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id);
        setProyecto(proyectoActualizado);

    }

    const actualizarTareaProyecto = tarea => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea._id ? tarea : tareaState )
        setProyecto(proyectoActualizado)
    }
    const cambiarEstadoTarea = tarea => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    //Cerrar Sesion

    const CerraSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})

    }


    return (

        <ProyectosContext.Provider
            value={{
                alerta,
                setAlerta,
                submitProyecto,
                proyectos,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                handleModalTarea,
                modalFormularioTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                handleModalEliminarTarea,
                modalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                modalEliminarColaborador,
                handleModalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                handleBuscador,
                buscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                CerraSesionProyectos
            }}>

            {children}
        </ProyectosContext.Provider>
    )
}

export default ProyectosContext

export {
    ProyectosProvider
}