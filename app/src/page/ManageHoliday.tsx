import { useState } from "react";
import { Container } from "react-bootstrap";
import { Button, Calendar, Input, Table, Tooltip } from "antd";
import { CheckOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { ColumnsType } from "antd/es/table";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";

export default function ManageHoliday(){
    const [datas, setData] = useState<{
        [name: string]: any
        date?: string,
        description?: string
        status: string
    }[]>([
        {
            status: "ADD"
        }
    ])
    const columns: ColumnsType = [
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
                        minDate={dayjs(Date.now())}
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
        tempData.sort((a: any, b: any) => {
            if(a.date == null || b.date == null){
                return
            }
            return a.date.localeCompare(b.date);
        })
        setData(tempData.concat({status: "ADD"}))
    }
    const deleteAction = (index: number) => {
        const tempData = []
        for(let i = 0; i < datas.length; i++){
            if(index == i){
                continue;
            }
            tempData.push(datas[i])
        }
        setData(tempData)
    }
    
    return (
        <Container fluid className="p-5 d-flex flex-column gap-4">
            <h2 className="text-center">管理假期</h2>
            <div className="d-flex flex-row gap-4">
                <div className="w-100">
                    <Calendar cellRender={(date: Dayjs, info: any) => {
                        const data = datas.filter((data) => data.date === date.format("YYYY-MM-DD"))
                        const exists = data.length !== 0
                        return (
                            !exists ? null : 
                            <Tooltip placement="top" title={"事由：" + data[0].description}>
                                <div className="p-2 text-center rounded bg-danger bg-opacity-25">
                                    <p className="m-0"> 活動暫停 </p>
                                </div>
                            </Tooltip>
                        )
                    }}></Calendar>
                </div>
                <div className="w-100">
                    <Table columns={columns} dataSource={datas}></Table>
                </div>
            </div>
        </Container>
    )
}