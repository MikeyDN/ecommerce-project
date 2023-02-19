import React, { useState } from 'react'
import Footer from './Footer'
import TopNavbar from '../Nav/TopNavbar'
import { Category } from '../../lib/types'
import Cart from '../Cart/Cart'
function Layout(props: { children: any | null }) {
  return (
    <>
      <TopNavbar />
      {props.children}
      <Cart />
      <Footer />
    </>
  )
}

export default Layout
