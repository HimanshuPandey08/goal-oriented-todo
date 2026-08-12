import { useContext ,useEffect } from "react";
import { AuthContext } from "../auth.context";
import { register, login , logout , getMe } from "../services/auth.api";



export const useAuth = ()=>{
    const context = useContext(AuthContext)
    const { user , setUser , loading , setLoading } = context

    const handleRegister = async ({username , email , password })=>{
        try {
            setLoading(true)
            const data = await register({username, email , password})
            setUser(data.user)           
        } finally{
            setLoading(false)
        }

    }

    const handleLogin = async ({email , password})=>{
        try {
            setLoading(true)
            const data = await login({email, password})
            setUser(data.user) 
        } finally{
            setLoading(false)
        }
    }

    const handleLogout = async ()=>{
        try {
            setLoading(true)
            const data = await logout()
            setUser(null)      
            
        } finally{
            setLoading(false)
        }
    } 

    useEffect(() => {
        const getAndSetUser = async ()=>{
            try {
                const data = await getMe();
                setUser(data.user)
            } catch (err) {
                setUser(null)
            } finally{
                setLoading(false)
            }
        }

        getAndSetUser()
    }, [])
    
    return {user , loading ,handleRegister, handleLogin , handleLogout   }

}