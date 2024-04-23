import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Badge, Button, Calendar, Input, Table, Tooltip } from "antd";
import { CheckOutlined, DeleteOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { ColumnsType } from "antd/es/table";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useAppDispatch } from "../store/hook";
import { addHoliday, deleteHoliday, getHolidays } from "../store/dataApi/HolidayApiSlice";
import { HolidayAddPayload, HolidayDataType } from "../type/holiday/HolidayPayload";

interface HolidayDataTypeWithStatusType extends HolidayDataType {
    status: "ADD" | "EDIT" | "DELETE"
}

const emptyAddStatusData = {
    id: 0,
    date: undefined,
    name: "",
    status: "ADD"
} as HolidayDataTypeWithStatusType

export default function ManageHoliday(){
    const dispatch = useAppDispatch()
    const [operationRow, setOperationRow] = useState<HolidayDataTypeWithStatusType>(emptyAddStatusData);
    const [datas, setData] = useState<(HolidayDataTypeWithStatusType)[]>([])
    const [editingDate, setEditingDate] = useState<Dayjs>();
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
            render: (text: string, record: any, _index: number) => {
                if(record["status"] == "EDIT"){
                    // return <Input className="text-center" defaultValue={text} onChange={e => handleColumnChange(index, "date", e.target.value)}></Input>
                    return (
                        <Tooltip title={"請指定日期"} open={isEditingDateError} defaultOpen={isEditingDateError}>
                            <DatePicker
                                disabledDate={(date, _info) => datas.some(data => data.date === date.format("YYYY-MM-DD"))}
                                minDate={dayjs(Date.now())}
                                className="text-center"
                                format="YYYY-MM-DD"
                                onChange={date => setEditingDate(date)}
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
            dataIndex: "name",
            className: "text-center",
            key: "name",
            width: "20%",
            render: (_text: any, record: any, _index: number) => {
                if(record["status"] == "EDIT"){
                    return (
                        <Tooltip title={"請描述事由"} open={isEditingDescriptionError} defaultOpen={isEditingDescriptionError}>
                            <Input status={isEditingDescriptionError ? "error" : ""} className="text-center" defaultValue={record["name"]} onChange={e => setEditingDescription(e.target.value)}></Input>
                        </Tooltip>
                    )
                }
                return <span>{record["name"]}</span>
            }
        },
        {
            title: "操作",
            className: "text-center",
            dataIndex: "status",
            width: "20%",
            render: (text: any, record: any, _index: number) => {
                if(text == "ADD"){
                    return <Button type="primary" className="bg-primary" shape="circle" icon={<PlusOutlined/>} onClick={async () => await editAction()}></Button>
                }else if(text == "EDIT"){
                    return <Button type="primary" className="bg-success" shape="circle" icon={<CheckOutlined/>} onClick={async () => await doneAction()}></Button>
                }else if(text == "DELETE"){
                    return <Button type="primary" className="bg-danger" shape="circle" icon={<DeleteOutlined/>} onClick={() => deleteAction(record["date"])}></Button>
                }else if(text === "REQUESTING"){
                    return <Button type="primary" className="bg-secondary" shape="circle" icon={<LoadingOutlined />}></Button>
                }
                return null
            }
        }
    ]
    const editAction = async () => {
        setOperationRow({
            ...operationRow,
            status: "EDIT"
        })
    }

    const doneAction = async () => {
        if(editingDate == null || editingDescription.length == 0 || datas.some(data => data.date === editingDate.format("YYYY-MM-DD"))){
            setShowError(true)
            return
        }
        dispatch(addHoliday({
            date: editingDate,
            name: editingDescription
        } as HolidayAddPayload)).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                setOperationRow(emptyAddStatusData)
                refreshData()
            }
        })
    }
    const deleteAction = (date: string) => {
        dispatch(deleteHoliday(date)).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                refreshData()
            }
        })
    }

    const refreshData = async () => {
        await dispatch(getHolidays()).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                const payload = response.payload;
                const datas = payload["data"] as HolidayDataType[];
                const templist = ([operationRow] as HolidayDataTypeWithStatusType[])
                    .concat(Object.assign([] as HolidayDataTypeWithStatusType[], datas.map((data) => {
                        return {
                            ...data,
                            status: "DELETE"
                        } as HolidayDataTypeWithStatusType
                    })))
                setData(templist)
            }
        })
    }

    useEffect(() => {
        refreshData()
    }, [operationRow])

    useEffect(() => {
        setShowError(false)
        if(editingDate === undefined){
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
                    <Calendar cellRender={(date: Dayjs, _info: any) => {
                        const data = datas.find((data) => data.date === date.format("YYYY-MM-DD"))
                        const exists = data !== undefined
                        return (
                            !exists ? null : 
                            <li key={data.name}>
                                <Badge status="error" text={`假期：${data.name}`}></Badge>
                            </li>
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