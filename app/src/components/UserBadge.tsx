import { Nav } from "react-bootstrap";
import { getSelfUserInfo } from "../store/dataApi/UserApiSlice";
import { useAppDispatch } from "../store/hook";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { removeToken } from "../store/dataApi/AuthApiSlice";
import { UserType } from "../type/user/userType";
import UserAvatar from "../page/components/UserAvatar";
import { Dropdown, Menu, MenuProps } from "antd";

function UserBadge(){
    const dispatch = useAppDispatch()
    const navigator = useNavigate()
    const { state } = useLocation()
    const [ isLogin, setIsLogin ] = useState<boolean | undefined>(undefined);
    const [ user, setUser ] =useState<UserType | undefined>()

    const items: MenuProps["items"] = [
        {
            label: (
                isLogin == undefined ? null : 
                isLogin == true && user ? 
                <div className="d-flex flex-row gap-2">
                    <UserAvatar account={user.account} size="sm"></UserAvatar>
                    <span className="my-auto">{user.name}</span>
                </div> :
                <Nav.Link href="/login">登入</Nav.Link>
            ),
            key: 'SubMenu',
            children: isLogin ? [
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
                    label: <div onClick={() => navigator("/manageHostSchedule")}>管理主持人排定規則</div>,
                    key: 5
                },
                {
                    type: "divider"
                },
                {
                    label: <div onClick={() => navigator("/")}>系統設定</div>,
                    key: 7
                },
                {
                    type: "divider"
                },
                {
                    label:  <div onClick={() => logout()}>登出</div>,
                    key: 6
                },
            ] : []
        }
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
        isLogin ? 
        <Menu mode="horizontal" style={{backgroundColor: "transparent", border: 0}} items={items} selectedKeys={[]}></Menu> :
        <Menu mode="horizontal" style={{backgroundColor: "transparent", border: 0}} items={items} selectedKeys={[]}></Menu> 
    )
}

export default UserBadge