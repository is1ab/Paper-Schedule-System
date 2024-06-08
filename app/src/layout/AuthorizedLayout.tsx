import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getSelfUserInfo } from "../store/dataApi/UserApiSlice";
import { useAppDispatch } from "../store/hook";

function AuthorizedLayout(){
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getSelfUserInfo()).then((response) => {
            if(response.meta.requestStatus === 'rejected'){
                navigate("/")
            }
        })
    }, [dispatch, navigate])

    return (
        <Outlet></Outlet>
    )
}

export default AuthorizedLayout;