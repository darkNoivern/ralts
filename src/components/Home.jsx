import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Link } from 'react-router-dom';
import {
    deleteDoc,
    collection,
    onSnapshot,
    doc,
    setDoc,
} from "firebase/firestore";

const Home = () => {

    const { currentUser } = useContext(AuthContext)

    const navigate = useNavigate();
    const [room, setRoom] = useState("");

    const [available, setAvailable] = useState([]);

    const transactionsCollectionRef = collection(db, "transactions");

    useEffect(() => {
        onSnapshot(transactionsCollectionRef, (snapshot) => {
            const newarr = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            })
            const xArr = newarr.filter((elements, index) => {
                return (
                    elements.creater === currentUser.uid
                )
            })
            setAvailable(xArr)

        });

    }, [currentUser]);

    const deleteRoom = (element) => {
        deleteDoc(doc(db, "transactions", element.generatedId))
            .then(() => {
                navigate('/');
                console.log("Entire Document has been deleted successfully.")
            })
            .catch(error => {
                console.log(error);
            })
    }

    const join = () => {

        const newid = uuid().slice(24);
        setDoc(doc(db, "transactions", newid), {
            generatedId: newid,
            creater: currentUser.uid,
            transactions: new Array(),
        });

        navigate(`/send/${newid}`)
    }

    const receive = (event) => {
        event.preventDefault();
        navigate(`/receive/${room}`)
    }

    return (
        <>
            <div className='page p-5'>
                <div className='flex justify-around items-center fix-top'>
                    <div className="grid home-page-cards">
                        <div className='home-cards border-black rounded p-3 bg-white'>
                            <p className='home-cards-title flexy mt-2'>
                                Send
                            </p>
                            <p className='mb-2 flexy'>
                                <button
                                    onClick={join}
                                    className='px-2 rounded border-black hover:bg-black hover:text-white'>
                                    Create a Room
                                </button>
                            </p>
                        </div>
                        <div className='home-cards border-black p-3 rounded bg-white'>
                            <p className='home-cards-title receive-title flexy mt-2'>
                                Receive
                            </p>
                            <p className='mb-2'>
                                <form
                                    onSubmit={receive}
                                    action="">
                                    <label className='mb-2' htmlFor="">Join a room</label>
                                    <input
                                        onChange={(event) => { setRoom(event.target.value) }}
                                        value={room}
                                        className='rounded border-black join-room-input px-2 py-0.5' type="text" />
                                    <div className='mt-3 flexy'>
                                        <button
                                            className='border-black hover:bg-black hover:text-white px-2 mt-2 rounded'>
                                            Join
                                        </button>
                                    </div>
                                </form>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flexy p-5">
                    <div className="available-rooms">
                        <div className='mb-3'>
                            Available Rooms
                        </div>
                        <div className='grid available-rooms-grid'>
                            {
                                available.map((element, index) => {
                                    return (
                                        <>
                                            <div className="available-cards border-black rounded p-2">
                                                <div className="flexy mt-4">
                                                    Room id : {element.generatedId}
                                                </div>
                                                <div className="flex justify-between px-2 mt-4">
                                                    <button
                                                        onClick={()=>{deleteRoom(element)}}
                                                        className="border-black rounded px-2">
                                                        Delete
                                                    </button>
                                                    <Link
                                                        exact
                                                        to={`/send/${element.generatedId}`}
                                                        className="border-black rounded bg-black text-white px-2">Join Room</Link>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home