import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import Home from './components/Home/Home.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import BookFav from './components/BookFav/BookFav.js';
import MyBook from './components/MyBook/MyBook.js'
import Favorites from './components/Favorites/Favorites.js'
import Savedbook from './components/Savedbook/Savedbook.js'
import BookDetail from './components/BookDetail/ิBookDetail.js'
import Profile from './components/Profile/Profile.js'
import AdminPage from './components/AdminPage/AdminPage.js'
import 'bootstrap/dist/css/bootstrap.min.css';

import { UserAuthContextProvider } from './context/UserAuthContext.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/home",
    element: <ProtectedRoute><Home /></ProtectedRoute>
  },
  {
    path: '/bookdetails/:id',
    element: <BookFav />
  },
  {
    path: "/mybook",
    element: <MyBook />
  },
  {
    path: "/favorites",
    element: <Favorites />
  },
  {
    path: "/savedbook",
    element: <Savedbook />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/bookdetail/:id",
    element: <BookDetail />
  },
  {
    path: "/adminpage",
    element: <AdminPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>,
)