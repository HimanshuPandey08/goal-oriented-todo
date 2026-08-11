import { useState } from "react"
import { Link } from "react-router"
import "../auth.form.scss"

const Register = () => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleForm = (e)=>{
        e.preventDefault()
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