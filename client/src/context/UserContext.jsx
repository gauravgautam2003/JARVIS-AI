import { createContext, useEffect, useState } from 'react'
import axios from "axios"

export const userDataContext = createContext()

function UserContext({ children }) {
    const serverUrl = "https://jarvis-ai-b7dn.onrender.com";
    const [userData, setUserData] = useState(null);
    const [frontentImage, setFrontentImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const handlecurrentUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
            console.log(result.data)
            setUserData(result.data)
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    const getGeminiResponse = async (command) => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, {command}, {withCredentials:true})
            return result.data
        } catch (error) {
                console.log(error)    
        }
    }
    useEffect(() => {
        handlecurrentUser();
    }, [])

    const value = {
        serverUrl,
        userData,
        setUserData,
        frontentImage,
        setFrontentImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage,
        getGeminiResponse
    }
    return (

        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>

    )
}

export default UserContext
