import { Dropdown, Nav } from "react-bootstrap";
import { Avatar } from "rsuite";
import { getSelfUserInfo } from "../store/dataApi/UserApiSlice";
import { useAppDispatch } from "../store/hook";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function UserBadge(){
    const dispatch = useAppDispatch()
    const { state } = useLocation()
    const [ isLogin, setIsLogin ] = useState<boolean | undefined>(undefined);
    const [ username, setUsername ] = useState<string>("");

    useEffect(() => {
        dispatch(getSelfUserInfo()).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                const payload = response.payload;
                setUsername(payload["data"]["username"]);
                setIsLogin(true)
            }else{
                setIsLogin(false)
            }
        })
    }, [state])
    
    return (
        <>
        {
            isLogin == undefined ? null : 
            isLogin == true ?
            <Dropdown>
                <Dropdown.Toggle variant="light" className="user-badge-dropdown d-flex border-0" style={{backgroundColor: "transparent"}}>
                    <Avatar size="sm"></Avatar>
                    &nbsp;&nbsp;
                    <span className="my-auto">{username}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="/user/0">查看個人資料</Dropdown.Item>
                    <Dropdown.Item href="/addSchedule">新增行程請求</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="/logout">登出</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown> :
            <Nav.Link href="/login">登入</Nav.Link>
        }
        </>
    )
}

export default UserBadge