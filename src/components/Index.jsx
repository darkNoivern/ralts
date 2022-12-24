import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Home from './Home'
import Send from './Send';
import Error from './Error';
import Login from './Login';
import Navbar from './Navbar';
import Receive from './Receive';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Index = () => {

    const { currentUser } = useContext(AuthContext)

    return (
        <>
            {/* <div className='bg-lime-400 sp-bg'> */}
            <Router>

                <div className='sp-bg'>
                    <Navbar />
                    <Routes>
                        <Route exact path="/" element={currentUser ? <Home /> : <Login />} />
                        <Route exact path="/send/:id" element={currentUser ? <Send /> : <Login />} />
                        <Route exact path="/receive/:id" element={currentUser ? <Receive /> : <Login />} />
                        <Route exact path="/login" element={<Login />} />
                        <Route path= '*' element={<Error />} />
                    </Routes>
                </div>
            </Router>
        </>
    )
}

export default Index