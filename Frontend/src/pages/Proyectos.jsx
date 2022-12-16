import React from 'react'
import useProyectos from '../hooks/useProyectos';
import PreviewProyecto from '../components/PreviewProyecto';
import Alerta from '../components/Alerta';
import { useEffect } from 'react';

function Proyectos() {
  const { proyectos, alerta } = useProyectos()

  const { msg } = alerta
  return (
    <>
      {msg && <Alerta alerta={alerta} />}

      <h1 className="text-4xl font-black text-center">Proyectos</h1>

      <div className="bg-white shadow mt-10 rounded-lg ">

        {proyectos.length ? (

          proyectos.map(proyecto => (

            <PreviewProyecto

              key={proyecto._id}
              proyecto={proyecto} />

          )

          )

        ) : <p className='mt-5 text-center text-gray-400 p-5'>No hay proyectos aun</p>}


      </div>

    </>
  )
}

export default Proyectos