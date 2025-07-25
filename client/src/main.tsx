import { createRoot } from 'react-dom/client'
import "./index.css"
import App from './App'
import {Provider} from "react-redux"
import store from "./store/store";
import React, { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
    <Toaster />
  </Provider> 
)
