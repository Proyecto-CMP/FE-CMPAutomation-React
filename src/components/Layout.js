import React from 'react'
import FormPeriodo from './formPeriodo'
import FormFiles from './formFiles'
import FormContratos from './formContratos'
import { useState } from 'react'

const Layout = () => {
  //get and decrypt rut from localstorage token
  const [rutUser, setRutUser] = useState('')
  const rut = localStorage.getItem('token').split('.')[1]
  const rutDecoded = JSON.parse(atob(rut))
  if(rutUser === '') {
    setRutUser(rutDecoded.rut)
  }

  return (
    <>
      <div style={{ backgroundImage : 'url(https://fondosmil.com/fondo/88266.jpg)',height:"100vh", backgroundRepeat: 'no-repeat'}}>
        <div className="grid grid-cols-3 h-full" >
          <div className="pt-20 p-10 col-span-1"><FormPeriodo /></div>
          {rutUser === "5807727-5" ? <div className="pt-20 p-10 col-span-1"><FormContratos/></div> : <p></p> }
          <div className="pt-20 p-10 col-span-1"><FormFiles /></div>
      </div>
    </div>
    </>
  )
}

export default Layout
