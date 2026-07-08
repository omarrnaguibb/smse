import React from 'react'
import NavBar from '../component/NavBar'
import Footer from '../component/Footer'

const NotFound = ({checkMode,setMode, mode}) => {
  return (
    <div>

        <div className='flex w-full  text-2xl  items-center justify-center' style={{height:'50vh'}}>{checkMode('Page Not Found  | Error 4044','الصفحه غير موجوده | خطأ 404').word}</div>

    </div>
  )
}

export default NotFound