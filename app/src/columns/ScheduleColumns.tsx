import { Badge, Button } from "antd"
import { UserType } from "../type/user/userType"
import { ScheduleStatusType } from "../type/schedule/ScheduleType"
import UserAvatar from "../page/components/UserAvatar"
import { NavigateFunction } from "react-router-dom"

export function getScheduleColumn(navigate: NavigateFunction){
    return [
        {
            title: "ID",
            dataIndex: "id",
            className: "text-center",
            key: "id",
            width: "20%"
        },
        {
            title: "使用者",
            dataIndex: "user",
            className: "text-center",
            key: "user",
            width: "20%",
            render: (user: UserType | null, _record: any, _index: number) => {
                if(user == null){
                    return ""
                }
                return (
                    <Button type="default" className="mx-auto d-flex flex-row gap-2 justify-content-center">
                        <UserAvatar account={user.account} size="xs"></UserAvatar>
                        <span className="my-auto"> {user.name} </span>
                    </Button>
                )
            }
        },
        {
            title: "活動名稱",
            dataIndex: "name",
            className: "text-center",
            key: "name",
            width: "20%"
        },
        {
            title: "處理狀態",
            dataIndex: "status",
            className: "text-center",
            key: "status",
            width: "20%",
            render: (status: ScheduleStatusType, _record: any, _index: number) => {
                const color = ["white", "#777777", "green", "red"]
                return <Badge count={status.name} color={color[status.id]}></Badge>
            }
        },
        {
            title: "操作",
            dataIndex: "action",
            className: "text-center",
            key: "action",
            width: "20%",
            render: (_text: any, record: any, _index: number) => {
                return (
                <div className="d-flex flex-row gap-3"> 
                    <Button type="primary" onClick={() => navigate(`/Schedule/${record["id"]}`)} style={{background: "orange"}}>查看事件</Button>
                    <Button type="primary" onClick={() => navigate(`./${record["id"]}`)}>進行審核</Button>
                </div>
                )
            }
        }
    ]
}