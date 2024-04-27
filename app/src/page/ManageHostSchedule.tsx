import { Button, Table } from "antd";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hook";
import { useEffect, useState } from "react";
import { getHostRules } from "../store/dataApi/HostRuleApiSlice";
import { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import { getWeekdayLabelByValue } from "../items/WeekdayItems";
import { getPeriodLabelByValue } from "../items/PeriodItems";
import { getScheduleRuleLabelByValue } from "../items/ScheduleItems";

export default function ManageHostSchedule(){
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [tableData, setTableData] = useState([])
    const columns: ColumnProps<any>[] = [
        {
            title: "#",
            key: "id",
            width: 100,
            className: "text-center",
            dataIndex: "id"
        },        
        {
            title: "規則名稱",
            key: "name",
            width: 200,
            className: "text-center",
            dataIndex: "name"
        },
        {
            title: "規則使用者",
            key: "users",
            className: "text-center",
            dataIndex: "users",
            width: 200,
            render: (user: any, _record: any, _index: number) => {
                return (
                    <div className="">
                        { user.map((user: any) => 
                            <p className="my-0">{user.name}</p>
                        )}
                    </div>
                )
            }
        },
        {
            title: "規則期限",
            key: "range",
            width: 200,
            className: "text-center",
            dataIndex: "range",
            render: (_text: any, record: any, _index: number) => {
                return <>
                    <p className="my-0">{`${record["startDate"].format("YYYY-MM-DD")} 至`}</p>
                    <p className="my-0">{`${record["endDate"].format("YYYY-MM-DD")}`}</p>
                </>
            }
        },
        {
            title: "排程條件",
            key: "schedule",
            width: 200,
            className: "text-center",
            dataIndex: "schedule",
            render: (_text: any, record: any, _index: number) => {
                const period = record["period"]
                const weekday = record["weekday"]
                return <>
                    <p className="my-0">{`${getPeriodLabelByValue(period)}`}</p>
                    <p className="my-0">{`每${getWeekdayLabelByValue(weekday)}舉行一次`}</p>
                </>
            }
        },
        {
            title: "排程規則",
            key: "rule",
            width: 200,
            className: "text-center",
            dataIndex: "rule",
            render: (text: any) => {
                return getScheduleRuleLabelByValue(text)
            }
        },
        {
            key: 4,
            className: "text-center",
            title: "操作",
            width: 300,
            render: () => {
                return <div className="d-flex flex-row gap-2 justify-content-center">
                    <Button type="primary">修改規則</Button>
                    <Button danger type="primary">刪除規則</Button>
                </div>
            }
        }
    ]
    useEffect(() => {
        dispatch(getHostRules()).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                const payload = response.payload;
                const datas = payload["data"]
                const tableDatas = datas.map((data: any) => {
                    return {
                        key: data.name,
                        id: data.id,
                        name: data.name,
                        users: data.users,
                        period: data.period,
                        weekday: data.weekday,
                        startDate: dayjs(data.startDate, "YYYY-MM-DD"),
                        endDate: dayjs(data.endDate, "YYYY-MM-DD"),
                        rule: data.rule
                    }
                })
                setTableData(tableDatas)
            }
        })
    }, [])
    return (
        <div>
            <Container className="p-5 text-center">
                <h2 className="text-center mb-5">管理主持人排定規則</h2>
                <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-row justify-content-end w-100">
                        <Button type="primary" className="w-25" onClick={() => navigate("/manageHostSchedule/0/Edit")}>新增規則</Button>
                    </div>
                    <Table columns={columns} dataSource={tableData}></Table>
                </div>
            </Container>
        </div>
    )
}