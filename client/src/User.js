import React, { useState, useEffect } from 'react'
import { requestUrl } from './constant'

export default function User() {
  const [loginStatus, setLoginStatus] = useState('loading')

  useEffect(() => {
    const url = `${requestUrl}/login`
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'zac1',
        password: '12345678'
      })
    })
      .then(response => response.json())
      .then(data => {
        const { success } = data || {}
        if(success) {
          setLoginStatus('success')
        } else {
          setLoginStatus('error')
        }
      })
      .catch(error => {
        console.error(error)
        setLoginStatus('error')
      })
  }, [])


  return (
    <h1>{`Log In Status: ${loginStatus}`}</h1>
  )
}