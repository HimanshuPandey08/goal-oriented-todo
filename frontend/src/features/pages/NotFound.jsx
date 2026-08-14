import { Link } from "react-router"
import "./notFound.scss"

const NotFound = () => {

    return (
        <main className="not-found">

            <div className="not-found-text">
                404
            </div>

            <div className="not-found-content">

                <div className="not-found-message">

                    <span className="not-found-label">
                        PAGE NOT FOUND
                    </span>

                    <h1>
                        Looks like you
                        <br />
                        lost your way.
                    </h1>

                    <p>
                        The page you're looking for doesn't exist
                        or may have been moved.
                    </p>

                    <Link
                        to="/"
                        className="not-found-button"
                    >
                        Back to Goal Flow
                    </Link>

                </div>


                <div className="not-found-scene">

                    <div className="not-found-container">

                        <div className="not-found-caveman">

                            <div className="not-found-leg">
                                <div className="not-found-foot">
                                    <div className="not-found-fingers"></div>
                                </div>
                            </div>

                            <div className="not-found-leg">
                                <div className="not-found-foot">
                                    <div className="not-found-fingers"></div>
                                </div>
                            </div>

                            <div className="not-found-body">
                                <div className="not-found-circle"></div>
                                <div className="not-found-circle"></div>
                            </div>

                            <div className="not-found-head">

                                <div className="not-found-eye">
                                    <div className="not-found-nose"></div>
                                </div>

                                <div className="not-found-mouth"></div>

                            </div>

                            <div className="not-found-arm">
                                <div className="not-found-club"></div>
                            </div>

                        </div>


                        <div className="not-found-caveman">

                            <div className="not-found-leg">
                                <div className="not-found-foot">
                                    <div className="not-found-fingers"></div>
                                </div>
                            </div>

                            <div className="not-found-leg">
                                <div className="not-found-foot">
                                    <div className="not-found-fingers"></div>
                                </div>
                            </div>

                            <div className="not-found-body">
                                <div className="not-found-circle"></div>
                                <div className="not-found-circle"></div>
                            </div>

                            <div className="not-found-head">

                                <div className="not-found-eye">
                                    <div className="not-found-nose"></div>
                                </div>

                                <div className="not-found-mouth"></div>

                            </div>

                            <div className="not-found-arm">
                                <div className="not-found-club"></div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    )
}

export default NotFound