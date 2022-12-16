import { Outlet, Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { ToastContainer } from 'react-toastify'

const RutaProtegida = () => {

    const { auth, cargando } = useAuth();
    if(cargando) return 'Cargando...'
    return (
        <>
            {auth._id ? 
            (
                <div className='bg-gray-100'>
                    <Header />

                    <div className='md:flex md:min-h-screen'>
                        <Sidebar />

                        <main className='p-10 flex-1 '>
                            <Outlet />
                            <ToastContainer autoClose={2000} />
                        </main>
                    </div>
                </div>
            ) : <Navigate to="/" />}
        </>
    )
}

export default RutaProtegida