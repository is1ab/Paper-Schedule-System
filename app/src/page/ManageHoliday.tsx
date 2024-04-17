import { useState } from "react";
import { Container } from "react-bootstrap";
import { Button, Input, Table } from "antd";
import { CheckOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { ColumnsType } from "antd/es/table";
import { DatePicker } from "antd";

export default function ManageHoliday(){
    const [datas, setData] = useState<{
        [name: string]: any
        date?: string,
        description?: string
        status: string
    }[]>([
        {
            date: "2024-04-17",
            description: "放假",
            status: "DELETE"
        },
        {
            status: "ADD"
        }
    ])
    const columns: ColumnsType = [
        {
            title: "ID",
            className: "text-center",
            width: "20%",
            render: (_text: any, record: any, index: number) => {
                if(record["status"] != "ADD"){
                    return <span>{index+1}</span>
                }
            }
        },
        {
            title: "日期",
            dataIndex: "date",
            className: "text-center",
            key: "date",
            width: "20%",
            render: (text: any, record: any, index: number) => {
                if(record["status"] == "EDIT"){
                    // return <Input className="text-center" defaultValue={text} onChange={e => handleColumnChange(index, "date", e.target.value)}></Input>
                    return <DatePicker
                        className="text-center"
                        format="YYYY-MM-DD"
                        onChange={date => handleColumnChange(index, "date", date.format("YYYY-MM-DD"))}
                    />
                }
                return <span>{text}</span>
            }
        },
        {
            title: "事由",
            dataIndex: "description",
            className: "text-center",
            key: "description",
            width: "20%",
            render: (_text: any, record: any, index: number) => {
                if(record["status"] == "EDIT"){
                    return <Input className="text-center" defaultValue={record["description"]} onChange={e => handleColumnChange(index, "description", e.target.value)}></Input>
                }
                return <span>{record["description"]}</span>
            }
        },
        {
            title: "操作",
            className: "text-center",
            dataIndex: "status",
            width: "20%",
            render: (text: any, _record: any, index: number) => {
                if(text == "ADD"){
                    return <Button type="primary" className="bg-primary" shape="circle" icon={<PlusOutlined/>} onClick={() => editAction(index)}></Button>
                }else if(text == "EDIT"){
                    return <Button type="primary" className="bg-success" shape="circle" icon={<CheckOutlined/>} onClick={() => doneAction(index)}></Button>
                }else if(text == "DELETE"){
                    return <Button type="primary" className="bg-danger" shape="circle" icon={<DeleteOutlined/>} onClick={() => deleteAction(index)}></Button>
                }
                return null
            }
        }
    ]
    const handleColumnChange = (index: number, key: string, value: any) => {
        const tempData = Object.assign([] as {
            date?: string,
            description?: string
            status: string
        }[], datas);
        tempData[index][key] = value;
        setData(tempData)
    }
    const editAction = (index: number) => {
        const tempData = Object.assign([] as {
            date?: string,
            description?: string
            status: string
        }[], datas);
        tempData[index].status = "EDIT"
        setData(tempData)
    }
    const doneAction = (index: number) => {
        const tempData = Object.assign([] as {
            date?: string,
            description?: string
            status: string
        }[], datas);
        tempData[index].status = "DELETE"
        setData(tempData.concat({status: "ADD"}))
    }
    const deleteAction = (index: number) => {
        const tempData = Object.assign([] as {
            date?: string,
            description?: string
            status: string
        }[], datas).splice(index - 1, 1);
        setData(tempData)
    }
    return (
        <Container className="p-5 d-flex flex-column gap-4">
            <h2 className="text-center">管理假期</h2>
            <Table columns={columns} dataSource={datas}></Table>
        </Container>
    )
}