import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, deleteDoc, collection, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, storage } from '../firebase.config';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from 'uuid';
import NoRoom from './NoRoom';
import { RWebShare } from "react-web-share";
import { ShareSocial } from 'react-share-social'

const Send = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext)

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

        });

    }, [currentUser]);

    const thisDocRef = doc(db, "transactions", id);



    //  UPLOADING A IMAGE 
    const handleFireBaseUpload = (e) => {

        const imageAsFile = e.target[0].files[0]
        const file = e.target[0].files[0];
        e.preventDefault()

        console.log('start of upload')

        // async magic goes here...
        if (imageAsFile === '') {
            console.error(`not an image, the image file is a ${typeof (imageAsFile)}`)
        }

        const storageRef = ref(storage, `/${imageAsFile.name}`)

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    const uxid = uuid();
                    const newObj = {
                        id: uxid,
                        sender: currentUser.uid,
                        filename: imageAsFile.name,
                        url: downloadURL,
                        seen: new Array(1).fill(currentUser.uid),
                    }
                    updateDoc(thisDocRef, {
                        transactions: arrayUnion(newObj)
                    });

                    document.querySelector('.file-input').value = null;
                });
            }
        );
    }

    const closeroom = () => {
        deleteDoc(doc(db, "transactions", id))
            .then(() => {
                navigate('/');
                console.log("Entire Document has been deleted successfully.")
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <>
            {
                present.length === 0
                    ?
                    <NoRoom />
                    :
                    <div className="page p-5">
                        <div className='my-5 flexy'>
                            Room code :&nbsp;
                            <button
                                onClick={async () => {
                                    try {
                                        await navigator.share({
                                            text: id,
                                        });
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }}>
                                {id}
                            </button>
                        </div>
                        <div className='flexy'>
                            <div>
                                <form action="" onSubmit={handleFireBaseUpload}>
                                    <input type="file" className='mb-3 file-input p-5' />
                                    <div className='flexy'>
                                        <button className='rounded border-black py-1 px-2'>Upload</button>
                                    </div>
                                </form>
                                {
                                    currentUser.uid === present[0].creater
                                        ?
                                        <div className="flexy">
                                            <button
                                                onClick={closeroom}
                                                className='rounded px-2 py-1 my-5 text-white bg-black border-black'>
                                                Close Room
                                            </button>
                                        </div>
                                        :
                                        <></>
                                }
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default Send