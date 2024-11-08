import React from 'react'

function Input({type , placeholder}) {
  return (
    <>
    <input type={type} placeholder={placeholder} className="input input-bordered input-sm w-full max-w-xs" />

    </>
  )
}

export default Input