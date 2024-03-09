import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import 'rsuite/dist/rsuite.min.css';
import RootLayout from './layout/RootLayout.tsx';
import Home from './page/Home.tsx';
import Login from './page/Login.tsx';
import Event from './page/Event.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<Home/>} />
      <Route path="/Login" element={<Login/>}></Route>
      <Route path="/Event" element={<Event/>}></Route>
    </Route>
  )
);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
