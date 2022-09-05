import React from 'react'
import FormPeriodo from './formPeriodo'
import FormFiles from './formFiles'

const Layout = () => {

  return (
    <>
      <div style={{ backgroundImage : 'url(https://fondosmil.com/fondo/88266.jpg)',height:"100vh", backgroundRepeat: 'no-repeat'}}>
        <div className="grid grid-cols-3 h-full" >
          <div className="pt-20 p-10 col-span-1"><FormPeriodo /></div>
          <p></p>
          <div className="pt-20 p-10 col-span-1"><FormFiles /></div>
      </div>
    </div>
    </>
  )
}

export default Layout
