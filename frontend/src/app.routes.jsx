import {  createBrowserRouter } from "react-router";
import Home from './features/auth/pages/Home'
import Register from './features/auth/pages/Register'
import Login from './features/auth/pages/Login'
import Dashboard from "./features/goal/pages/Dashboard";
import Protected from "./features/auth/components/Protected";


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
    },
    {
        path:"/dashboard",
        element: <Protected> <Dashboard/></Protected>    
    }

])
