import React from 'react'
import FormPeriodo from './formPeriodo'

const Layout = () => {

  return (
    <>
    <div style={{ backgroundImage : 'url(https://ingeoexpert.com/wp-content/uploads/2018/01/1920px-Chuqui001.jpg)' }}>
      <div className="pt-20" >
        <div className="grid grid-cols-3">
          <FormPeriodo />
          <p></p>
          <FormPeriodo />
        </div>
      </div>
    </div>
    </>
  )
}

export default Layout
