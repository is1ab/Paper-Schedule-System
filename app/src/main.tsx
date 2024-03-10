import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import 'rsuite/dist/rsuite-no-reset.min.css';
import '../src/index.css'
import RootLayout from './layout/RootLayout.tsx';
import Home from './page/Home.tsx';
import Login from './page/Login.tsx';
import Event from './page/Event.tsx';
import Member from './page/Member.tsx';
import User from './page/User.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<Home/>} />
      <Route path="/Login" element={<Login/>}></Route>
      <Route path="/Event" element={<Event/>}></Route>
      <Route path="/Member" element={<Member/>}></Route>
      <Route path="/User/:userId" element={<User/>}></Route>
    </Route>
  )
);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>,
)
