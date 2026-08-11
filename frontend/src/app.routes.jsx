import {  createBrowserRouter } from "react-router";
import Home from './features/auth/pages/Home'
import Register from './features/auth/pages/Register'
import Login from './features/auth/pages/Login'



export const router =  createBrowserRouter([
    {
        path:"/",
        element:<Home/>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element: <Register/>
    }

])
