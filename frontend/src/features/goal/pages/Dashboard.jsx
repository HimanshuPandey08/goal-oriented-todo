import { Link } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"
import "../styles/dashboard.scss"

const Dashboard = () => {

    const { handleLogout, user } = useAuth()

    const logoutHandler = () => {
        handleLogout()
    }

    const goals = [
        {
            id: 1,
            title: "Learn React",
            completed: false
        },
        {
            id: 2,
            title: "Build Portfolio",
            completed: false
        },
        {
            id: 3,
            title: "Learn Node.js",
            completed: true
        },
        {
            id: 4,
            title: "Complete DSA Course",
            completed: false
        }
    ]

    return (
        <main className="dashboard-page">

            <header className="dashboard-header">

                <div className="dashboard-brand">
                    <div className="dashboard-brand-mark">
                        <svg viewBox="0 0 31.5 48.5" aria-hidden="true">
                            <defs>
                                <linearGradient
                                    id="dashboard-brand-gradient"
                                    x1="8"
                                    y1="0"
                                    x2="34.1"
                                    y2="28.9"
                                >
                                    <stop offset="0" stopColor="#9e9e9e" />
                                    <stop offset=".28" stopColor="#a6a6a6" />
                                    <stop offset=".40" stopColor="#3a3a3a" />
                                    <stop offset=".60" stopColor="#7a7a7a" />
                                    <stop offset=".80" stopColor="#a9a9a9" />
                                    <stop offset=".95" stopColor="#c4c4c4" />
                                    <stop offset="1" stopColor="#cccccc" />
                                </linearGradient>
                            </defs>

                            <path
                                d="M21.5 0 L21.5 19.5 L31.5 19.5 L31.5 29 L10 48.5 L10 28.5 L0.5 28.5 L0.5 18.5 Z"
                                fill="url(#dashboard-brand-gradient)"
                            />

                            <rect
                                x="0.5"
                                y="18.5"
                                width="9"
                                height="10"
                                fill="#fdfdfd"
                            />

                            <rect
                                x="22"
                                y="19.5"
                                width="9.5"
                                height="9.5"
                                fill="#fdfdfd"
                            />
                        </svg>
                    </div>

                    <span>GOAL FLOW</span>
                </div>

                <div className="dashboard-user">

                    <span>
                        {user?.username}
                    </span>

                    <button
                        className="dashboard-logout"
                        onClick={logoutHandler}
                    >
                        Logout
                    </button>

                </div>

            </header>

            <section className="dashboard-content">

                <div className="dashboard-intro">

                    <div>
                        <span className="dashboard-eyebrow">
                            YOUR WORKSPACE
                        </span>

                        <h1>
                            Your Goals
                        </h1>

                        <p>
                            Focus on what you want to achieve.
                        </p>
                    </div>

                    <button className="create-goal-button">
                        + Create Goal
                    </button>

                </div>

                <section className="goals-section">

                    <div className="goals-header">
                        <h2>All Goals</h2>

                        <span>
                            {goals.length} goals
                        </span>
                    </div>

                    <div className="goals-list">

                        {goals.map((goal) => (

                            <Link
                                to={`/goals/${goal.id}`}
                                className={`goal-item ${
                                    goal.completed
                                        ? "completed"
                                        : ""
                                }`}
                                key={goal.id}
                            >

                                <div className="goal-left">

                                    <span className="goal-indicator">
                                        {goal.completed ? "✓" : ""}
                                    </span>

                                    <span className="goal-title">
                                        {goal.title}
                                    </span>

                                </div>

                                <div className="goal-right">

                                    <span className="goal-status">
                                        {goal.completed
                                            ? "Completed"
                                            : "In progress"
                                        }
                                    </span>

                                    <span className="goal-arrow">
                                        →
                                    </span>

                                </div>

                            </Link>

                        ))}

                    </div>

                </section>

            </section>

        </main>
    )
}

export default Dashboard