import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Customize from './pages/Customize'
import { userDataContext } from './context/UserContext'
import Customize2 from './pages/Customize2'
import Home from './pages/Home'


function App() {
    const { userData, setUserData } = useContext(userDataContext);
    return (
        <>
            <div className='w-screen h-[100vh]'>
                <Routes>

                    <Route path='/' element={(userData?.assistantImage && userData?.assistantName)? <Home /> : <Navigate to={"/customize"} />} />
                    <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
                    <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={"/"} />} />
                    <Route path='/customize' element={userData ? <Customize /> : <Navigate to={"/signup"} />} />
                    <Route path='/customize2' element={userData ? <Customize2 /> : <Navigate to={"/signup"} />} />
                </Routes>
            </div>
        </>
    )
}

export default App
