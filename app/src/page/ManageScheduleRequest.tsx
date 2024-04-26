import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ScheduleStatusType, ScheduleType } from "../type/schedule/ScheduleType";
import { useAppDispatch } from "../store/hook";
import { getAllSchedule } from "../store/dataApi/ScheduleApiSlice";
import { Badge, Button, Table } from "antd";
import UserAvatar from "./components/UserAvatar";
import { UserType } from "../type/user/userType";
import { HostRuleDataType } from "../type/host/HostRuleType";
import { useNavigate } from "react-router-dom";

function ManageScheduleRequest(){
    const naviage = useNavigate()
    const dispatch = useAppDispatch()
    const [schedules, setSchedules] = useState<ScheduleType[] | null>(null);
    const [scheduleTableData, setScheduleTableData] = useState<{
        id: string,
        user: UserType | undefined
        name: string,
        status: ScheduleStatusType,
        hostrule: HostRuleDataType | undefined,
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
            render: (user: UserType | null, _record: any, _index: number) => {
                return user == null ? "" : (
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
                    <Button type="primary" onClick={() => naviage(`/Schedule/${record["id"]}`)} style={{background: "orange"}}>查看事件</Button>
                    <Button type="primary" onClick={() => naviage(`./${record["id"]}`)}>進行審核</Button>
                </div>
                )
            }
        }
    ]

    useEffect(() => {
        dispatch(getAllSchedule()).then((response) => {
            if(response.meta.requestStatus == 'fulfilled'){
                const payload = response.payload;
                const datas = (payload["data"] as ScheduleType[]).filter(data => {
                    if([1, 2, 3].includes(data.status.id)){
                        return (data.hostRule != null && data.hostRule.rule == "SCHEDULE") || (data.hostRule == null)
                    }
                });
                setSchedules(datas);
                setScheduleTableData(datas.map(data => {
                    return {
                        id: data.id,
                        user: data.user,
                        name: data.name,
                        status: data.status,
                        hostrule: data.hostRule,
                        action: ""
                    }
                }))
            }
        })
    }, [])

    return (
        <Container className="p-5 text-center">
            <h2 className="text-center mb-5">管理活動請求</h2>
            <div className="d-flex flex-column gap-3">
                <Table loading={schedules == null} columns={columns} dataSource={scheduleTableData} className="w-100 text-center"></Table>
            </div>
        </Container>
    )
}

export default ManageScheduleRequest;