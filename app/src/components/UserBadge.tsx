import { Nav } from "react-bootstrap";
import { getSelfUserInfo } from "../store/dataApi/UserApiSlice";
import { useAppDispatch } from "../store/hook";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { removeToken } from "../store/dataApi/AuthApiSlice";
import { UserType } from "../type/user/userType";
import UserAvatar from "../page/components/UserAvatar";
import { Dropdown, MenuProps } from "antd";

function UserBadge(){
    const dispatch = useAppDispatch()
    const navigator = useNavigate()
    const { state } = useLocation()
    const [ isLogin, setIsLogin ] = useState<boolean | undefined>(undefined);
    const [ user, setUser ] =useState<UserType | undefined>()

    const items: MenuProps["items"] = [
        {
            label: <div onClick={() => navigator("/user/0")}>查看個人資料</div>,
            key: 0
        },
        {
            label: <div onClick={() => navigator("/addSchedule")}>新增行程請求</div>,
            key: 1
        },
        {
            type: "divider"
        },
        {
            label: <div onClick={() => navigator("/manageUser")}>管理實驗室成員</div>,
            key: 2
        },
        {
            label: <div onClick={() => navigator("/manageScheduleRequest")}>管理活動請求</div>,
            key: 3
        },
        {
            label: <div onClick={() => navigator("/manageHoliday")}>管理假期</div>,
            key: 4
        },
        {
            type: "divider"
        },
        {
            label:  <div onClick={() => logout()}>登出</div>,
            key: 5
        },
    ]

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
            <>
                <Dropdown.Button type="default" style={{backgroundColor: "transparent"}} menu={{items}}>
                    <div className="d-flex flex-row gap-2">
                        <UserAvatar account={user.account} size="xs"></UserAvatar>
                        <span className="my-auto">{user.name}</span>
                    </div>
                </Dropdown.Button>
                {/* <Dropdown>
                    <Dropdown.Item href="/user/0">查看個人資料</Dropdown.Item>
                    <Dropdown.Item href="/addSchedule">新增行程請求</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="/manageUser">管理實驗室成員</Dropdown.Item>
                    <Dropdown.Item href="/manageUserWeight">管理報告順序權重</Dropdown.Item>
                    <Dropdown.Item href="/manageScheduleRequest">管理活動請求</Dropdown.Item>
                    <Dropdown.Item href="/manageHoliday">管理假期</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => logout()}>登出</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>  */} </> :
            <Nav.Link href="/login">登入</Nav.Link>
        }
        </>
    )
}

export default UserBadge