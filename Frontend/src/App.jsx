import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EditarProyecto from './pages/EditarProyecto'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthLayout from './Layout/AuthLayout'
import Login from './pages/Login'
import OlvidePassword from './pages/OlvidePassword'
import Registrar from './pages/Registrar'
import NuevoPassword from './pages/NuevoPassword'
import ConfirmarCuenta from './pages/ConfirmarCuenta'
import NuevoProyecto from './pages/NuevoProyecto'


import { AuthProvider } from './context/AuthProvider'
import { ProyectosProvider } from './context/ProyectoProvider'
import RutaProtegida from './Layout/RutaProtegida'
import Proyectos from './pages/Proyectos'
import Proyecto from './pages/Proyecto'
import NuevoColaborador from './pages/NuevoColaborador'



function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <ProyectosProvider>
          <Routes>

            <Route path='/' element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path='registrar' element={<Registrar />} />
              <Route path='olvide-password' element={<OlvidePassword />} />
              <Route path='olvide-password/:token' element={<NuevoPassword />} />
              <Route path='confirmar/:id' element={<ConfirmarCuenta />} />

            </Route>

            {/* Area Privada */}


            <Route path='proyectos' element={<RutaProtegida />}>

              <Route index element={<Proyectos />} />
              <Route path='crear-proyecto' element={<NuevoProyecto />} />
              <Route path='nuevo-colaborador/:id' element={<NuevoColaborador />} />
              <Route path=':id' element={<Proyecto/>} />  
              <Route path='editar/:id' element={<EditarProyecto/>} />  
              

            </Route>

          </Routes>
        </ProyectosProvider>
      </AuthProvider>

    </BrowserRouter>

  )
}

export default App
