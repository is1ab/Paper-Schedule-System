import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Button, Calendar, Input, Table, Tooltip } from "antd";
import { CheckOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { ColumnsType } from "antd/es/table";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { setDate } from "rsuite/esm/utils/dateUtils";

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
    const [editingDate, setEditingDate] = useState<string>("");
    const [editingDescription, setEditingDescription] = useState<string>(""); 
    const [showError, setShowError] = useState<boolean>(false);
    const [showEditingDateError, setShowEditingDateError] = useState<boolean>(false);
    const [showEditingDescriptionError, setShowEditingDescriptionError] = useState<boolean>(false);
    const isEditingDateError = showError && showEditingDateError;
    const isEditingDescriptionError = showError && showEditingDescriptionError
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
                    return (
                        <Tooltip title={"請指定日期"} open={isEditingDateError} defaultOpen={isEditingDateError}>
                            <DatePicker
                                disabledDate={(date, info) => datas.some(data => data.date === date.format("YYYY-MM-DD"))}
                                minDate={dayjs(Date.now())}
                                className="text-center"
                                format="YYYY-MM-DD"
                                onChange={date => setEditingDate(date.format("YYYY-MM-DD"))}
                                status={isEditingDateError ? "error" : ""}
                            />
                        </Tooltip>
                    )
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
                    return (
                        <Tooltip title={"請描述事由"} open={isEditingDescriptionError} defaultOpen={isEditingDescriptionError}>
                            <Input status={isEditingDescriptionError ? "error" : ""} className="text-center" defaultValue={record["description"]} onChange={e => setEditingDescription(e.target.value)}></Input>
                        </Tooltip>
                    )
                }
                return <span>{record["description"]}</span>
            }
        },
        {
            title: "操作",
            className: "text-center",
            dataIndex: "status",
            width: "20%",
            render: (text: any, record: any, index: number) => {
                if(text == "ADD"){
                    return <Button type="primary" className="bg-primary" shape="circle" icon={<PlusOutlined/>} onClick={() => editAction()}></Button>
                }else if(text == "EDIT"){
                    return <Button type="primary" className="bg-success" shape="circle" icon={<CheckOutlined/>} onClick={() => doneAction()}></Button>
                }else if(text == "DELETE"){
                    return <Button type="primary" className="bg-danger" shape="circle" icon={<DeleteOutlined/>} onClick={() => deleteAction(record["date"], index)}></Button>
                }
                return null
            }
        }
    ]
    const editAction = () => {
        const tempData = Object.assign([] as {
            date?: string,
            description?: string
            status: string
        }[], datas);
        tempData[0].status = "EDIT"
        setData(tempData)
    }
    const doneAction = () => {
        const tempData = Object.assign([] as {
            date?: string,
            description?: string
            status: string
        }[], datas);
        if(editingDate.length == 0 || editingDescription.length == 0 || datas.some(data => data.date === editingDate)){
            setShowError(true)
            return
        }
        tempData.push({
            date: editingDate,
            description: editingDescription,
            status: "DELETE"
        })
        tempData[0] = {
            status: "ADD"
        }
        tempData.sort((a: any, b: any) => {
            if(a.date == null || b.date == null){
                return
            }
            return b.date.localeCompare(a.date);
        })
        setEditingDate("")
        setEditingDescription("")
        setData(tempData)
    }
    const deleteAction = (date: string, index: number) => {
        const tempData = []
        for(let i = 0; i < datas.length; i++){
            if(datas[i].date === date){
                continue;
            }
            tempData.push(datas[i])
        }
        setData(tempData)
    }

    useEffect(() => {
        setShowError(false)
        if(editingDate.length === 0){
            setShowEditingDateError(true)
        }else{
            setShowEditingDateError(false)
        }
    }, [editingDate])
    
    useEffect(() => {
        setShowError(false)
        if(editingDescription.length === 0){
            setShowEditingDescriptionError(true)
        }else{
            setShowEditingDescriptionError(false)
        }
    }, [editingDescription])
    
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