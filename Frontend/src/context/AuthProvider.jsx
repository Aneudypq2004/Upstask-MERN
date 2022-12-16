import { createContext, useState, useEffect } from "react";
import clientesAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {

        const autenticarUsuario = async () => {
            
            const token = localStorage.getItem('token');

            if (!token) {
                setCargando(false)
                return
            }

            const config = {

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {

                const { data } = await clientesAxios('/usuarios/perfil', config);
                setAuth(data)

            } catch (error) {
                setAuth({})
            }
            setCargando(false)

        }

        autenticarUsuario()
    }, [])


    const cerraSesionAuth = () => {
        setAuth({})
    }


    return (
        <AuthContext.Provider
            value={{
                setAuth,
                auth,
                cargando,
                cerraSesionAuth

            }}>
            {children}
        </AuthContext.Provider>

    )
}

export { AuthProvider }


export default AuthContext