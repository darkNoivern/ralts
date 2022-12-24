import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useParams } from 'react-router-dom';
import { db } from '../firebase.config';
import axios from 'axios';
import {
    collection,
    onSnapshot,
    doc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { getBytes } from 'firebase/storage';
import NoRoom from './NoRoom';


const Receive = () => {

    const { id } = useParams();
    const { currentUser } = useContext(AuthContext)

    const [arr, setArr] = useState([]);
    const [xi, setXi] = useState([]);
    const [present, setPresent] = useState([]);

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
                    elements.generatedId === id
                )
            })
            setPresent(xArr);
            setXi(xArr[0].transactions);
            if (xArr.length > 0) {
                const tArr = xArr[0].transactions.filter((elements, index) => {
                    return (
                        (!elements.seen.includes(currentUser.uid))
                    )
                })
                setArr(tArr);
            }
        });

    }, [currentUser]);

    const cancel = (element) => {

        const update = xi;
        update.forEach((ele, i) => {
            if (ele.id === element.id) {
                ele.seen.push(currentUser.uid);
            }
        })
        const thisDocRef = doc(db, "transactions", id);
        updateDoc(thisDocRef, { transactions: update });

    }

    const download = (element) => {

        axios({
            url: element.url,
            method: 'GET',
            responseType: 'blob'
        })
            .then((response) => {
                const url = window.URL
                    .createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', element.filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })

        const update = xi;
        update.forEach((ele, i) => {
            if (ele.id === element.id) {
                ele.seen.push(currentUser.uid);
            }
        })
        const thisDocRef = doc(db, "transactions", id);
        updateDoc(thisDocRef, { transactions: update });
    }

    return (
        <>
            {
                present.length === 0 ?
                    <NoRoom />
                    :
                    <div className='p-5 page'>
                        <div className='my-5 flexy'>
                            Room code : {id}
                        </div>
                        <div className="flexy pt-5">

                            <div className='grid receive-collection'>
                                {
                                    arr.map((element, index) => {
                                        return (
                                            <>
                                                <div key={index} className="receive-card border-black rounded">
                                                    <div className='my-5 flexy p-2'>
                                                        {element.filename}
                                                    </div>
                                                    <div className='flex justify-around pt-2'>

                                                        <button
                                                            onClick={() => { cancel(element) }}
                                                            className="border-black rounded px-2">Cancel</button>
                                                        <button
                                                            onClick={() => { download(element) }}
                                                            className='border-black bg-black text-white px-2 rounded'>
                                                            Download
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default Receive