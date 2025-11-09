import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/image3.png'
import { RiImageAddLine } from 'react-icons/ri'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from 'react-icons/md';


function Customize() {
    const { frontentImage, setFrontentImage, backendImage, setBackendImage,selectedImage, setSelectedImage } = useContext(userDataContext)
    const inputImage = useRef();
    const navigate = useNavigate()

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackendImage(file)
            setFrontentImage(URL.createObjectURL(file))
        }
    }
    return (
        <>
            <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#010148] flex justify-center items-center flex-col p-[20px] mb-[40px]'>
                
                <MdKeyboardBackspace className='text-white h-[30px] w-[30px] cursor-pointer absolute top-[20px] left-[20px]' onClick={() => navigate("/")} />

                <h1 className='text-white text-[30px] mb-5 text-center'>Select your <span className='text-blue-300'>Assistant Image</span></h1>
                <div className='w-[100%]  flex justify-center items-center flex-wrap gap-5 '>
                    <Card image={image1} />
                    <Card image={image2} />
                    <Card image={image3} />
                    <div className={`lg:w-[120px] lg:h-[200px] w-[100px] h-[140px] overflow-hidden bg-[#030326] border-2 border-[blue] rounded-2xl hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${selectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950":null}`} onClick={() =>{
                        inputImage.current.click()
                        setSelectedImage("input")
                    }}>
                        {
                            !frontentImage && <RiImageAddLine className='text-white h-[20px] w-[20px]' />
                        }
                        {
                            frontentImage && <img src={frontentImage} className='h-full object-cover'/>
                        }
                    </div>
                    <input type="file" accept='image/*' hidden ref={inputImage} style={{display: 'none'}} onChange={handleImage} />
                </div>
                {
                selectedImage && <button className='min-w-[150px] h-[50px] mt-[30px]  cursor-pointer text-black font-semibold bg-white rounded-full text-[19px] 'onClick={()=>navigate("/customize2")}>Next</button>
                }
            </div>
        </>
    )
}

export default Customize
