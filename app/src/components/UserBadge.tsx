import { Dropdown, Nav } from "react-bootstrap";
import { Avatar } from "rsuite";

function UserBadge(){
    const isLogin: boolean = false;
    return (
        <>
        {
            isLogin ? 
            <Dropdown>
                <Dropdown.Toggle variant="light" className="user-badge-dropdown d-flex border-0" style={{backgroundColor: "transparent"}}>
                    <Avatar size="sm"></Avatar>
                    &nbsp;
                    <span className="my-auto">使用者</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="/you">查看個人資料</Dropdown.Item>
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