import React from 'react'
import FormPeriodo from './formPeriodo'
import FormFiles from './formFiles'

const Layout = () => {

  return (
    <>
    <div style={{ backgroundImage : 'url(https://ingeoexpert.com/wp-content/uploads/2018/01/1920px-Chuqui001.jpg)',  width: '100vw', height: '100vh',backgroundRepeat: 'repeat',}}>
      <div className="pt-20 p-10" >
        <div className="grid grid-cols-3">
          <FormPeriodo />
          <p></p>
          <FormFiles />
        </div>
      </div>
    </div>
    </>
  )
}

export default Layout
