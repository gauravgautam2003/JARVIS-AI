import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/userContext'
import { MdKeyboardBackspace } from 'react-icons/md';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

function Customize2() {
    const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext);
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
    const navigate = useNavigate();

    const handleUpdateAssistant = async () => {
        try {
            let formData = new FormData();
            formData.append("assistantName", assistantName)
            if (backendImage) {
                formData.append("assistantImage", backendImage)
            } else {
                formData.append("imageUrl", selectedImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })

            setUserData(result.data)
            navigate("/")
        } catch (error) {
            if(error.response){
                console.log(error.response.message);
                console.log(error.response.status);
            }else{
                console.log(error);
            }
        }
    }
    return (
        <>
            <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#010148] flex justify-center items-center flex-col p-[20px] mb-[40px]'>
                
                <MdKeyboardBackspace className='text-white h-[30px] w-[30px] cursor-pointer absolute top-[20px] left-[20px]' onClick={() => navigate("/customize")} />

                <h1 className='text-white text-[30px] mb-5 text-center'>Enter your <span className='text-blue-300'>Assistant Name</span></h1>

                <input type="text" placeholder='eg. Shifra' className='w-full h-[50px] outline-none border-2 max-w-[600px] border-white bg-transparent text-white placeholder-gray-300 px-4 rounded-full text-[18px] py-2.5' required onChange={(e) => setAssistantName(e.target.value)} value={assistantName} />
                
                {
                    assistantName && <button className='min-w-[150px] h-[50px] mt-[30px]  px-2.5 cursor-pointer text-black font-semibold bg-white rounded-full text-[19px] ' onClick={
                        () => handleUpdateAssistant()}
                    >Create your assistant</button>
                }

            </div>
        </>
    )
}

export default Customize2