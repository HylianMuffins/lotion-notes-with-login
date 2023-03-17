import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import googleLogo from "./images/google-logo.png";

function Login() {
    const [ user, setUser ] = useState();
    const [ profile, setProfile ] = useState();
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    // log out function to log the user out of google and set the profile array to null
    // const logOut = () => {
    //     googleLogout();
    //     setProfile(null);
    // };

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );

    useEffect(
        () => {
            if (profile) {
                navigate("/notes");
            }
        }, [ profile, navigate ]
    );

    return (
        <section className="login">
            <div onClick={() => login()} className="sign-in google-button">
                <img className="google"
                    alt="Google sign-in"
                    src={googleLogo}
                />
                Login with Google
            </div>
        </section>
    );
}

export default Login;