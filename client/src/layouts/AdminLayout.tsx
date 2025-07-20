import useGetCurrentAdmin from '../hooks/admin/useGetCurrentAdmin'
import React, { useState } from 'react'

import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { MoonLoader } from 'react-spinners'
  
const AdminLayout = () => {
 
 
 
   const {admin,isLoading,error} = useGetCurrentAdmin()
  
 
    return <Outlet />
}

export default AdminLayout