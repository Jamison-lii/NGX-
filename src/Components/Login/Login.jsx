import React from 'react'
import bg from '../../assets/Design/bg.jpg'

const Login = () => {
  return (
     <div
  className=" bg-cover bg-white bg-center bg-no-repeat h-[450px]  rounded-md "
  style={{
    backgroundImage: `url(${bg})`, // or full URL
  }}
>
  <div className="w-full h-full"></div>
</div>
  )
}

export default Login