import { useState } from "react"
import { Link } from "react-router"
import "../auth.form.scss"


const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleForm = (e)=>{
        e.preventDefault();
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

                </div>

            </div>

        </main>
    )
}

export default Login