import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { NavLink, Link } from 'react-router-dom'
import { auth } from '../firebase.config'
import { signOut } from "firebase/auth";

const Navbar = () => {
    const { currentUser } = useContext(AuthContext)

    const logout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <>
        <div className="flexy nav-kindof">

            <div className='navbar'>
                <div className='flex px-5 justify-between items-center'>
                    <div className='flexy'>
                        <img src="https://www.serebii.net/art/th/280.png" className='navbar-img mr-3' alt="" />
                        <Link
                        exact to='/'
                        >
                        Ralts
                        </Link>
                    </div>
                    {
                        currentUser === null ?
                            <NavLink exact to="/login" activeclassname="active">
                                Login
                            </NavLink>
                            :
                            <span className='cursor-pointer'
                                onClick={logout}
                            >Logout</span>
                    }
                </div>
            </div>
        </div>
        </>
    )
}

export default Navbar