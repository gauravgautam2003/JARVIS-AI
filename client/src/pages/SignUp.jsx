import { useContext, useState } from 'react'
import bg from "../assets/authBg.jpg"
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Navigate, useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';

function SignUp() {
    const { serverUrl, userData, setUserData } = useContext(userDataContext);
    const [showPassword, setshowPassword] = useState(false);
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("")
    
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErr("")

        
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                name,
                email,
                password
            }, { withCredentials: true });

            setUserData(result.data);
            navigate("/customize");
            // Optionally navigate or show success message here
        } catch (error) {
            
            setErr(error.response.data.message);
            setUserData(null);
            if (error.response) {
                console.log(error.response.data.message); // Backend error message
                console.log(error.response.status); // Status code
            } else {
                console.log(error);
            }
        }
    }
    return (
        <>
            <div className='flex justify-center items-center w-full h-[100vh] bg-cover' style={{ backgroundImage: `url(${bg})` }}>
                <form onSubmit={handleSignUp} className=' flex flex-col items-center justify-center w-[90%] h-[500px] max-w-[400px] bg-[#00000062] backdrop-blur shadow-lg shadow-black opacity-90 px-5 gap-[20px]'>
                    <h1 className='text-white text-[25px] mb-[30px] font-semibold text-center'>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>

                    <input type="text" placeholder='Enter your name' className='w-full h-[50px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-2.5 py-2.5 rounded-full text-[18px] ' required onChange={(e) => setName(e.target.value)} value={name} />

                    <input type="text" placeholder='Enter your email' className='w-full h-[50px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-2.5 rounded-full text-[18px] py-2.5' required onChange={(e) => setEmail(e.target.value)} value={email} />

                    <div className='w-full h-[50px]  border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
                        <input type={showPassword ? "text" : "password"} placeholder='Enter your password' className='w-full h-full outline-none  border-white bg-transparent text-white placeholder-gray-300 px-2.5  py-2.5 rounded-full text-[18px] ' required onChange={(e) => setPassword(e.target.value)} value={password} />
                        {
                            !showPassword && <IoMdEye className='absolute cursor-pointer w-[25px]  h-[25px] right-[15px] top-[10px]' onClick={() => setshowPassword(true)} />
                        }
                        {
                            showPassword && <IoMdEyeOff className='absolute w-[25px]  h-[25px] right-[15px] cursor-pointer top-[10px]' onClick={() => setshowPassword(false)} />
                        }

                    </div>
                    
                    {
                        err.length>0 && <p className='text-red-500 text-[18px]'>
                            *{err}
                        </p>
                    }
                    <button className='min-w-[150px] h-[50px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] ' >Sign Up</button>

                    <p className='text-white text-[18px] cursor-pointer text-center' onClick={() => navigate("/signin")}>Already have an account? <span className='text-blue-400 text-[18px]'>Sign In</span></p>
                </form>
            </div>
        </>
    )
}

export default SignUp
