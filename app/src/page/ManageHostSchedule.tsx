import { Button, Table } from "antd";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ManageHostSchedule(){
    const navigate = useNavigate()
    const columns = [
        {
            key: 0,
            title: "ID",
            dataKey: "id"
        },
        {
            key: 1,
            title: "規則名稱",
            dataKey: "ruleName"
        },
        {
            key: 2,
            title: "規則使用者",
            dataKey: "ruleUsers"
        },
        {
            key: 3,
            title: "排程週次",
            dataKey: "ruleRepeat"
        },
        {
            key: 4,
            title: "操作",
        }
    ]
    return (
        <div>
            <Container className="p-5 text-center">
                <h2 className="text-center mb-5">管理主持人排定規則</h2>
                <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-row justify-content-end w-100">
                        <Button type="primary" className="w-25" onClick={() => navigate("/manageHostSchedule/0/Edit")}>新增規則</Button>
                    </div>
                    <Table columns={columns}></Table>
                </div>
            </Container>
        </div>
    )
}