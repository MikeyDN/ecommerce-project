import React, { useState } from 'react'
import Footer from './Footer'
import TopNavbar from './nav/TopNavbar'
import { Category } from '../lib/types'
import Cart from './Cart'
function Layout(props: { children: any | null; categories: Category[] }) {
  return (
    <>
      <TopNavbar categories={props.categories} />
      {props.children}
      <Cart />
      <Footer />
    </>
  )
}

export default Layout
