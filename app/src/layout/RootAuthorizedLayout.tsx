import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getSelfUserInfo } from "../store/dataApi/UserApiSlice";
import { useAppDispatch } from "../store/hook";

function RootAuthorizedLayout(){
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getSelfUserInfo()).then((response) => {
            if(response.meta.requestStatus === 'rejected'){
                navigate("/")
            }
            const payload = response.payload;
            const account = payload["data"]["account"];
            if(account !== "root"){
                navigate("/")
            }
        })
    }, [dispatch, navigate])

    return (
        <Outlet></Outlet>
    )
}

export default RootAuthorizedLayout;