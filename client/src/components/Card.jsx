import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

function Card({ image }) {
  const { frontentImage, setFrontentImage, backendImage, setBackendImage, selectedImage, setSelectedImage } = useContext(userDataContext)
  return (
    <>
      <div className={`lg:w-[120px] lg:h-[200px] w-[100px] h-[140px] oveflow-hidden bg-[#030326] border-2 border-[blue] rounded-2xl hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white 
        ${selectedImage == image ? "border-4 border-white shadow-2xl shadow-blue-950" : null}`}
        onClick={() => {
          setSelectedImage(image)
          setBackendImage(null)
          setFrontentImage(null)
          }}>

        <img src={image} className='h-full object-cover rounded-2xl'/>
      </div>
    </>
  )
}

export default Card
