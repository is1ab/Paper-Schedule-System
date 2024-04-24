import { Button, Table } from "antd";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hook";
import { useEffect, useState } from "react";
import { getHostRules } from "../store/dataApi/HostRuleApiSlice";

export default function ManageHostSchedule(){
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [tableData, setTableData] = useState([{
        id: 0,
        name: ""
    }])
    const columns = [
        {
            title: "ID",
            key: "id",
            dataKey: "id"
        },
        {
            title: "規則名稱",
            key: "name",
            dataKey: "name"
        },
        {
            title: "規則使用者",
            key: "users",
            dataKey: "users"
        },
        {
            title: "排程週次",
            key: "period",
            dataKey: "period"
        },
        {
            key: 4,
            title: "操作",
        }
    ]
    // useEffect(() => {
    //     dispatch(getHostRules()).then((response) => {
    //         if(response.meta.requestStatus === 'fulfilled'){
    //             const payload = response.payload;
    //             const datas = payload["data"]
    //             const tableDatas = datas.map((data: any) => {
    //                 return {
    //                     key: data.name,
    //                     id: "0",
    //                     name: data.name,
    //                     users: "",
    //                     period: data.period
    //                 }
    //             })
    //             setTableData(tableDatas)
    //         }
    //     })
    // }, [])
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