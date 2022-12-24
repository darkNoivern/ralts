import React, { useState, useEffect } from 'react'
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import {
    collection,
    onSnapshot,
    doc,
    setDoc,
} from "firebase/firestore";

const Login = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [email2, setEmail2] = useState("");
    const [password2, setPassword2] = useState("");

    const [illegalUsername, setIllegalUsername] = useState(false);
    const [usernamePresent, setUsernamePresent] = useState(false);
    const [emailPresent, setEmailPresent] = useState(false);
    const [error, setError] = useState(false);

    const [userlist, setUserlist] = useState([]);

    const navigate = useNavigate();

    function isAlphanumeric(str) {
        return /^[a-zA-Z0-9]+$/i.test(str)
    }

    const usersCollectionRef = collection(db, "users");
    useEffect(() => {
        onSnapshot(usersCollectionRef, (snapshot) => {

            const result = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            })
            setUserlist(result);
            // console.log(result)
        });
    }, []);

    const signup = (event) => {

        event.preventDefault();

        if (!isAlphanumeric(username)) {
            setIllegalUsername(true);
            return;
        }
        
        const checkUsernamePresent = userlist.find((individual) => {
            return (individual.displayName === username);
        })
        if (checkUsernamePresent !== undefined) {  //  USERNAME FOUND
            setUsernamePresent(true);
            return;
        }

        const checkEmailPresent = userlist.find((individual) => {
            return (individual.email === email);
        })
        if (checkEmailPresent !== undefined) {  //  USERNAME FOUND
            setEmailPresent(true);
            return;
        }


        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                // Signed in 
                const user = result.user;
                updateProfile(result.user, {
                    displayName: username,
                });

                setDoc(doc(db, "users", result.user.uid), {
                    uid: result.user.uid,
                    displayName: username,
                    email,
                    notebooks: [],
                });

                navigate("/");
                // ...
            })
            .catch((error) => {
                setError(true);
                setUsername("");
                setPassword("");
                setEmail("");
                return;
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });
    }

    const signin = (event) => {

        event.preventDefault();
        signInWithEmailAndPassword(auth, email2, password2)
            .then((result) => {
                // Signed in 
                const user = result.user;
                navigate("/");
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(true);
                setEmail2("");
                setPassword2("");
                return;
            });
    }

    return (
        <>
            <section className="section login__page flexy">

                {
                    illegalUsername &&
                    <div className="services__modal">
                        <div className="services__modal-content login__error__modal-content">
                            <h4 className="services__modal-title">Lechonk <br /> Guidelines</h4>
                            <i
                                onClick={() => {
                                    setIllegalUsername(false);
                                    setUsername("");
                                }}
                                className="uil uil-times services__modal-close">
                            </i>
                            <div>
                                Username should only contain a-z, A-Z, 0-9 and no spaces.
                            </div>
                        </div>
                    </div>
                }

                {
                    usernamePresent &&
                    <div className="services__modal">
                        <div className="services__modal-content login__error__modal-content">
                            <h4 className="services__modal-title">Lechonk <br /> Guidelines</h4>
                            <i
                                onClick={() => {
                                    setUsernamePresent(false);
                                    setUsername("");
                                }}
                                className="uil uil-times services__modal-close">
                            </i>
                            <div>
                                This username is already taken, choose a different one please 🥺.
                            </div>
                        </div>
                    </div>
                }
                {
                    emailPresent &&
                    <div className="services__modal">
                        <div className="services__modal-content login__error__modal-content">
                            <h4 className="services__modal-title">Lechonk <br /> Guidelines</h4>
                            <i
                                onClick={() => {
                                    setEmailPresent(false);
                                    setEmail("");
                                }}
                                className="uil uil-times services__modal-close">
                            </i>
                            <div>
                                This email is already in use, choose a different one please 🥺.
                            </div>
                        </div>
                    </div>
                }

                {
                    error &&
                    <div className="services__modal">
                        <div className="services__modal-content login__error__modal-content">
                            <h4 className="services__modal-title">Lechonk <br /> Guidelines</h4>
                            <i
                                onClick={() => {
                                    setError(false);
                                }}
                                className="uil uil-times services__modal-close">
                            </i>
                            <div>
                                Some error has occured, please retry.
                            </div>
                        </div>
                    </div>
                }


                <div className="login__main border-black">
                    <input
                        onClick={() => {
                            setEmail("");
                            setEmail2("");
                            setUsername("");
                            setPassword("");
                            setPassword2("");
                        }}
                        type="checkbox" id="chk" aria-hidden="true" />
                    <div className="signup">
                        <form
                            onSubmit={signup}

                            className='services__form'>
                            <label className='login__label' htmlFor="chk" aria-hidden="true">Sign Up</label>
                            <div className="flexy">
                                <input
                                    value={username}
                                    onChange={(event) => { setUsername(event.target.value); }}
                                    className='login__input border-gray-600' type="text" name="txt" placeholder='username' required="" />
                            </div>
                            <div className="flexy">
                                <input
                                    value={email}
                                    onChange={(event) => { setEmail(event.target.value); }}
                                    className='login__input' type="email" name="email" placeholder='email' required="" />
                            </div>
                            <div className="flexy">
                                <input

                                    value={password}
                                    onChange={(event) => { setPassword(event.target.value); }}
                                    className='login__input' type="password" name="pswd" placeholder='password' required="" />
                            </div>
                            <button
                                className='login__button flexy'>Sign Up</button>
                        </form>
                    </div>
                    <div className="login bg-gray-200">
                        <form onSubmit={signin}
                            className='services__form'>
                            <label className='login__label' htmlFor="chk" aria-hidden="true">Login</label>
                            <div className="flexy">
                                <input
                                    value={email2}
                                    onChange={(event) => { setEmail2(event.target.value); }}
                                    className='login__input' type="email" name="email" placeholder='email' required="" />
                            </div>
                            <div className="flexy">
                                <input
                                    value={password2}
                                    onChange={(event) => { setPassword2(event.target.value); }}
                                    className='login__input' type="password" name="pswd" placeholder='password' required="" />
                            </div>
                            <button className='login__button flexy'>Login</button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login