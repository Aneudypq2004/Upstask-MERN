import React from 'react'

export default function Alerta({ alerta }) {
    return (
        <div
            className={`${alerta.error ? 'from-red-400 to-red-600' : 'from-sky-400 to-sky-600'}
            bg-gradient-to-br text-center uppercase rounded-xl font-bold text-sm text-white p-3 my-10
                  `
            }
        >{alerta.msg}</div>
    )
}
