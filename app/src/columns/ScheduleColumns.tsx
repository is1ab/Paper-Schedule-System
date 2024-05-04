import { Badge, Button } from "antd"
import { UserType } from "../type/user/userType"
import { ScheduleStatusType, ScheduleType } from "../type/schedule/ScheduleType"
import { NavigateFunction } from "react-router-dom"
import UserAvatarButton from "../components/UserAvatarButton"

export function getScheduleColumn(navigate: NavigateFunction, verify: boolean = false){
    return [
        {
            title: "ID",
            dataIndex: "id",
            className: "text-center font-mono",
            key: "id",
            width: "10%",
            render: (id: string) => {
                return id.split("-")[4]
            }
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
                    <UserAvatarButton user={user}></UserAvatarButton>
                )
            }
        },
        {
            title: "活動名稱",
            dataIndex: "name",
            className: "text-center",
            key: "name",
            width: "30%"
        },
        {
            title: "活動規則",
            dataIndex: "date",
            className: "text-center",
            key: "date",
            width: "20%",
            render: (_date: any, record: any, _index: number) => {
                return <span>{record.hostRule?.name}</span>
            }
        },
        {
            title: "活動日期",
            dataIndex: "date",
            className: "text-center",
            key: "date",
            width: "15%",
            render: (_date: any, record: any, _index: number) => {
                return <span>{record.datetime}</span>
            }
        },
        {
            title: "處理狀態",
            dataIndex: "status",
            className: "text-center",
            key: "status",
            width: "15%",
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
                <div className="d-flex flex-row gap-3 justify-content-center"> 
                    { record.status.id != 4 &&
                        <Button type="primary" onClick={() => navigate(`/Schedule/${record["id"]}`)} style={{background: "orange"}}>查看事件</Button>
                    }
                    { verify && 
                        <Button type="primary" onClick={() => navigate(`./${record["id"]}`)}>進行審核</Button>
                    }
                </div>
                )
            }
        }
    ]
}