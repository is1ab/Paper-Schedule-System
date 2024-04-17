import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ScheduleStatusType, ScheduleType } from "../type/schedule/ScheduleType";
import { useAppDispatch } from "../store/hook";
import { getAllSchedule } from "../store/dataApi/ScheduleApiSlice";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Table } from "antd";
import { render } from "react-dom";
import UserBadge from "../components/UserBadge";
import UserAvatar from "./components/UserAvatar";

function ManageScheduleRequest(){
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [schedules, setSchedules] = useState<ScheduleType[] | null>(null);
    const [scheduleTableData, setScheduleTableData] = useState<{
        id: string,
        user: string,
        account: string
        name: string,
        status: string,
        statusId: number,
        action: string
    }[]>([])
    const columns = [
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
            render: (text: string, record: any, index: number) => {
                return (
                    <Button type="default" className="mx-auto d-flex flex-row gap-2 justify-content-center">
                        <UserAvatar account={record.account} size="xs"></UserAvatar>
                        <span className="my-auto"> {text} </span>
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
            render: (text: string, record: any, index: number) => {
                const color = ["white", "#777777", "green", "red"]
                return <Badge count={text} color={color[record["statusId"]]}></Badge>
            }
        },
        {
            title: "操作",
            dataIndex: "action",
            className: "text-center",
            key: "action",
            width: "20%",
            render: (text: string, record: any, index: number) => {
                return (
                <div className="d-flex flex-row gap-3"> 
                    <Button type="primary" style={{background: "orange"}}>查看事件</Button>
                    <Button type="primary">進行審核</Button>
                </div>
                )
            }
        }
    ]

    useEffect(() => {
        dispatch(getAllSchedule()).then((response) => {
            if(response.meta.requestStatus == 'fulfilled'){
                const payload = response.payload;
                const datas = payload["data"] as ScheduleType[];
                setSchedules(datas);
                setScheduleTableData(datas.map(data => {
                    return {
                        id: data.id,
                        user: data.user.name,
                        account: data.user.account,
                        name: data.name,
                        status: data.status.name,
                        statusId: data.status.id,
                        action: ""
                    }
                }))
            }
        })
    }, [])

    return (
        <Container className="p-5 text-center">
            <h2 className="text-center mb-5">管理活動請求</h2>
            {schedules && 
                <div className="d-flex flex-column gap-3">
                    <Table columns={columns} dataSource={scheduleTableData} className="w-100 text-center"></Table>
                </div>
            }
        </Container>
    )
}

export default ManageScheduleRequest;