import { useEffect, useState } from "react";
import { Badge, Button, Container, Table } from "react-bootstrap";
import { ScheduleStatusType, ScheduleType } from "../type/schedule/ScheduleType";
import { useAppDispatch } from "../store/hook";
import { getAllSchedule } from "../store/dataApi/ScheduleApiSlice";
import { useNavigate } from "react-router-dom";

function ManageScheduleRequest(){
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [schedules, setSchedules] = useState<ScheduleType[] | null>(null);

    useEffect(() => {
        dispatch(getAllSchedule()).then((response) => {
            if(response.meta.requestStatus == 'fulfilled'){
                const payload = response.payload;
                const data = payload["data"] as ScheduleType[];
                setSchedules(data);
            }
        })
    }, [])

    const ScheduleStatus = (props: {
        status: ScheduleStatusType
    }) => {
        const status = props.status;
        const color = ["", "primary", "success", "danger"]
        return (
            <Badge bg={color[status.id]}>{status.name}</Badge>
        )
    }

    const ScheduleRow = (props: {
        data: ScheduleType
    }) => {
        const data = props.data;
        return (
            <tr style={{verticalAlign: "middle"}}>
                <td className="text-nowrap font-monospace">{data.id.split("-")[4]}</td>
                <td className="text-nowrap">{`${data.user.name}`}</td>
                <td className="text-nowrap">{data.name}</td>
                <td className="text-nowrap">
                    <ScheduleStatus status={data.status}></ScheduleStatus>
                </td>
                <td>
                    { data.status.id == 1 &&
                        <Button className="text-nowrap" variant="primary" onClick={() => navigate(`./${data.id}`)}>簽核</Button>
                    }
                </td>
            </tr>
        )
    }

    return (
        <Container className="p-5 text-center">
            <h2 className="text-center mb-5">管理活動請求</h2>
            {schedules && 
                <div className="d-flex flex-column gap-3">
                    <Table bordered hover className="w-100 text-center">
                        <thead>
                            <tr>
                                <th> ID </th>
                                <th> 使用者 </th>
                                <th> 名稱 </th>
                                <th> 處理狀態 </th>
                                <th> 操作 </th>
                            </tr>
                        </thead>
                        <tbody>
                            { schedules.map((schedule) => {
                                return (
                                    <ScheduleRow data={schedule}></ScheduleRow>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            }
        </Container>
    )
}

export default ManageScheduleRequest;