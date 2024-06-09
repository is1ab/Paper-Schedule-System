import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getSelfUserInfo } from "../store/dataApi/UserApiSlice";
import { useAppDispatch } from "../store/hook";
import { UserType } from "../type/user/userType";

function AdminAuthorizedLayout(){
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getSelfUserInfo()).then((response) => {
            if(response.meta.requestStatus === 'rejected'){
                navigate("/")
            }
            const payload = response.payload as UserType;
            const roles = payload.roles;
            if(roles.find((role) => role.name == "Admin") === undefined){
                navigate("/")
            }
        })
    }, [dispatch, navigate])

    return (
        <Outlet></Outlet>
    )
}

export default AdminAuthorizedLayout;