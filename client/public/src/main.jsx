import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from './App'
import Homepage from './pages/HomePage.jsx'
import DetailsPage from './pages/DetailsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Homepage />
      },
      {
        path: 'home',
        element: <Homepage />
      },
      {
        path: 'lodgings/:id',
        element: <DetailsPage />
      },
      {
        path: 'error',
        element: <NotFoundPage />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
