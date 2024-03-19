import { Dropdown, Nav } from "react-bootstrap";
import { getSelfUserInfo } from "../store/dataApi/UserApiSlice";
import { useAppDispatch } from "../store/hook";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { removeToken } from "../store/dataApi/AuthApiSlice";
import { UserType } from "../type/user/userType";
import UserAvatar from "../page/components/UserAvatar";

function UserBadge(){
    const dispatch = useAppDispatch()
    const { state } = useLocation()
    const [ isLogin, setIsLogin ] = useState<boolean | undefined>(undefined);
    const [ user, setUser ] =useState<UserType | undefined>()

    useEffect(() => {
        dispatch(getSelfUserInfo()).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                const payload = response.payload;
                const user = payload["data"] as UserType;
                setUser(user);
                setIsLogin(true)
            }else{
                setIsLogin(false)
            }
        })
    }, [state])

    const logout = async () => {
        await dispatch(removeToken())
        location.href = "/"
    }
    
    return (
        <>
        {
            isLogin == undefined ? null : 
            isLogin == true && user ?
            <Dropdown>
                <Dropdown.Toggle variant="light" className="user-badge-dropdown d-flex border-0" style={{backgroundColor: "transparent"}}>
                    <UserAvatar account={user.account} size="sm"></UserAvatar>
                    &nbsp;&nbsp;
                    <span className="my-auto">{user.name}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="/user/0">查看個人資料</Dropdown.Item>
                    <Dropdown.Item href="/addSchedule">新增行程請求</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="/manageUser">管理實驗室成員</Dropdown.Item>
                    <Dropdown.Item href="/addSchedule">管理活動請求</Dropdown.Item>
                    <Dropdown.Item href="/addSchedule">管理活動</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => logout()}>登出</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown> :
            <Nav.Link href="/login">登入</Nav.Link>
        }
        </>
    )
}

export default UserBadge