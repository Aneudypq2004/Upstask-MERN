import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios";
import Alerta from "../components/Alerta";


function ConfirmarCuenta() {
  const [confirmada, setConfirmada] = useState(false)
  const [alerta, setAlerta] = useState({})

  const { id } = useParams();

  useEffect(() => {

    const verificar = async () => {

      try {
        const url = `${import.meta.env.VITE_API_URL}/usuarios/confirmar/${id}`

        const { data } = await axios(url);

        setAlerta({ msg: data.msg, error: false });

        setConfirmada(true)

      } catch (error) {

        setTimeout(() => {
          setAlerta({ msg: error.response.data.msg, error: true });
          setConfirmada(false)
        }, 3000);


      }

    }

    verificar()
  }, [])

  const { msg } = alerta


  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Confirma tu cuenta y Comienza a crear tus {''}
        <span className="text-slate-700">proyectos</span>
      </h1>

      <div className='mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white'>

        {msg && <Alerta alerta={alerta} />}

        {confirmada && (

          <Link
            className='block text-center my-5 text-slate-500 uppercase text-sm'
            to="/"
          >Inicia Sesión</Link>

        )}
      </div>
    </>
  )
}

export default ConfirmarCuenta