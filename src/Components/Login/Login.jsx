import React, { useState } from 'react'
import bg from '../../assets/Design/bg.jpg'

const Login = () => {
  const [formData, setFormData] = useState({
    email:"",
    password:"",
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
     <div
  className=" bg-cover  flex bg-white bg-center bg-no-repeat h-[450px]  rounded-md "
  style={{
    backgroundImage: `url(${bg})`, // or full URL
  }}
>
  <div className="w-full h-full flex flex-col   items-center">
    <div className='text-4xl pt-10 font-semibold text-[#4169E1]' > Welcome</div>
      
     <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your email"
                className="md:w-sm px-4 py-2 mt-20 text-gray-700 bg-transparent border border-gray-300 rounded-lg focus:ring focus:ring-[#4169E1] focus:outline-none"
                required
              />

                <input
                type="text"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Your password"
                className="sm:w-sm px-4 py-2 mt-4 text-gray-700 bg-transparent border border-gray-300 rounded-lg focus:ring focus:ring-[#4169E1] focus:outline-none"
                required
              />

               <div className='bg-[#4169E1] text-white mt-8 px-8 py-2 font-semibold rounded-md transition-normal cursor-pointer '>Login</div>
  </div>

 
</div>
  )
}

export default Login