import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import googleLogo from "./images/google-logo.png";

function Login() {
    const [loggingIn, setLoggingIn] = useState(false);
    const [login] = useOutletContext();

    const loginProcedure = () => {
        setLoggingIn(true);
        login();
    }

    if (loggingIn) {
        return (
            <section className="login">
                <div className="sign-in">
                    <span className="loading">Loading...</span>
                </div>
            </section>
        );
    } else {
        return (
            <section className="login">
                <div onClick={loginProcedure} className="sign-in google-button">
                    <img className="google"
                        alt="Google sign-in"
                        src={googleLogo}
                    />
                    Login with Google
                </div>
            </section>
        );
    }
}

export default Login;