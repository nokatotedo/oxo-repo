import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'
import LodgingsPage from './pages/LodgingsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import TypesPage from './pages/TypesPage.jsx'
import DetailsPage from './pages/DetailsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import FormLodgingPage from './pages/FormLodgingPage.jsx'
import FormTypePage from './pages/FormTypePage.jsx'
import FormUploadPage from './pages/FormUploadPage.jsx'

const mustLogin = () => {
  if(!localStorage.access_token) {
    return redirect('/login')
  }
  return null
}

const cantLoginAgain = () => {
  if(localStorage.access_token) {
    return redirect('/')
  }
  return null
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <LodgingsPage />,
        loader: mustLogin
      },
      {
        path: 'lodgings',
        element: <LodgingsPage />,
        loader: mustLogin
      },
      {
        path: 'lodgings/create',
        element: <FormLodgingPage type="Create"/>,
        loader: mustLogin
      },
      {
        path: 'lodgings/:id',
        element: <DetailsPage />,
        loader: mustLogin
      },
      {
        path: 'lodgings/:id/edit',
        element: <FormLodgingPage type="Edit"/>,
        loader: mustLogin
      },
      {
        path: 'lodgings/:id/upload',
        element: <FormUploadPage />,
        loader: mustLogin
      },
      {
        path: 'types',
        element: <TypesPage />,
        loader: mustLogin
      },
      {
        path: 'types/create',
        element: <FormTypePage type="Create"/>,
        loader: mustLogin
      },
      {
        path: 'types/:id/edit',
        element: <FormTypePage type="Edit"/>,
        loader: mustLogin
      },
      {
        path: 'login',
        element: <LoginPage />,
        loader: cantLoginAgain
      },
      {
        path: 'error',
        element: <NotFoundPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
        loader: mustLogin
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
