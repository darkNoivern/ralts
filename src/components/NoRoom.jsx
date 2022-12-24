import React from 'react'
import { Link } from 'react-router-dom'

const NoRoom = () => {

    return (
        <>
            <div className="page p-5 flexy">
                <div>
                    <div className='flexy'>
                        <img src="https://www.serebii.net/art/th/280.png" alt="" />
                    </div>
                    <div className='mt-3 mb-1'>
                        This room doesn't exist, but you can create one
                    </div>
                    <div className='my-1 flexy'>
                        <Link
                            className='cursor-pointer hover:bg-black hover:text-white py-0.5 px-2 rounded border-black'
                            exact to="/">
                            Teleport
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NoRoom