import { useState } from "react"
import { Link } from "react-router"
import "../auth.form.scss"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router"


const Login = () => {

    const { handleLogin , loading } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState(null)

    const handleForm = async (e)=>{
        e.preventDefault();
        try {
            setError(null)
            await handleLogin({email , password})
            navigate("/dashboard")
        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed"
            )
        }
    }

    if(loading){
        return <main> <h1>Loading .... </h1></main>
    }

    return (
        <main className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <h1 className="auth-title">Login</h1>
                    <form className="auth-form" onSubmit={handleForm}>
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
                                placeholder="Enter your password"
                            />
                        </div>

                        <button type="submit" className="auth-button">
                            Submit
                        </button>

                    </form>

                    <p className="auth-switch">
                        Don't have an account?
                        <Link to="/register"> Register</Link>
                    </p>

                    {error && <p>{error}</p>}

                </div>

            </div>

        </main>
    )
}

export default Login