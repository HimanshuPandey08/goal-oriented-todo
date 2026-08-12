import { useState } from "react"
import { Link, useNavigate } from "react-router"
import "../auth.form.scss"
import { useAuth } from "../hooks/useAuth"


const Register = () => {

    const {loading ,handleRegister }= useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleForm = async (e)=>{
        e.preventDefault()
        await handleRegister({username,email,password})
        navigate("/dashboard")
    }

    if(loading){
        return <main> <h1>Loading .... </h1></main>
    }

    return (
        <main className="auth-page">

            <div className="auth-container">

                <div className="auth-card">

                    <h1 className="auth-title">Register</h1>

                    <form className="auth-form" onSubmit={handleForm}>

                        <div className="form-group">
                            <label htmlFor="username">Username</label>

                            <input
                                type="text"
                                name="username"
                                id="username"
                                onChange={(e)=>{setUsername(e.target.value)}}
                                placeholder="Create your username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>

                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={(e)=>{setEmail(e.target.value)}}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>

                            <input
                                type="password"
                                name="password"
                                id="password"
                                onChange={(e)=>{setPassword(e.target.value)}}
                                placeholder="Create your password"
                            />
                        </div>

                        <button type="submit" className="auth-button">
                            Submit
                        </button>

                    </form>

                    <p className="auth-switch">
                        Already have an account?
                        <Link to="/login"> Login</Link>
                    </p>

                </div>

            </div>

        </main>
    )
}

export default Register