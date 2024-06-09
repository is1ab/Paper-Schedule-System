import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import "antd/dist/reset.css"
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
import AddSchedule from './page/AddSchedule.tsx';
import ManageUser from './page/ManageUser.tsx';
import EditUser from './page/EditUser.tsx';
import Schedule from './page/Schedule.tsx';
import ManageScheduleRequest from './page/ManageScheduleRequest.tsx';
import ManageUserWeight from './page/ManageUserWeight.tsx';
import ProcessScheduleRequest from './page/ProcessScheduleRequest.tsx';
import ManageHostSchedule from './page/ManageHostSchedule.tsx';
import ProcessHostSchedule from './page/ProcessHostShedule.tsx';
import AuthorizedLayout from './layout/AuthorizedLayout.tsx';
import RootAuthorizedLayout from './layout/RootAuthorizedLayout.tsx';
import UnauthorizedLayout from './layout/UnauthorizedLayout.tsx';
import AdminAuthorizedLayout from './layout/AdminAuthorizedLayout.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<Home/>} />
      <Route element={<UnauthorizedLayout />}>
        <Route path="/Login" element={<Login/>}></Route>
      </Route>
      <Route element={<AuthorizedLayout />}>
        <Route path="/Event" element={<Event/>}></Route>
        <Route path="/Member" element={<Member/>}></Route>
        <Route path="/User/:userId" element={<User/>}></Route>
        <Route path="/AddSchedule" element={<AddSchedule/>}></Route>
        <Route path="/Schedule/:scheduleId" element={<Schedule/>}></Route>
      </Route>
      <Route element={<AdminAuthorizedLayout />}>
        <Route path="/ManageUser" element={<ManageUser/>}></Route>
        <Route path="/ManageUserWeight" element={<ManageUserWeight/>}></Route>
        <Route path="/User/:userId/Edit" element={<EditUser/>}></Route>
        <Route path="/ManageScheduleRequest" element={<ManageScheduleRequest/>}></Route>
        <Route path="/ManageScheduleRequest/:scheduleId" element={<ProcessScheduleRequest/>}></Route>
        <Route path="/ManageHostSchedule" element={<ManageHostSchedule/>}></Route>
        <Route path="/ManageHostSchedule/:hostRuleId/Edit" element={<ProcessHostSchedule/>}></Route>
      </Route>
      <Route element={<RootAuthorizedLayout />}>
        <Route path="/System" element={<Home/>}></Route>
      </Route>
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
