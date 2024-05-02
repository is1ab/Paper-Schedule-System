import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ScheduleType } from "../type/schedule/ScheduleType";
import { useAppDispatch } from "../store/hook";
import { getAllSchedule } from "../store/dataApi/ScheduleApiSlice";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import { getScheduleColumn } from "../columns/ScheduleColumns";

function ManageScheduleRequest(){
    const naviage = useNavigate()
    const dispatch = useAppDispatch()
    const [schedules, setSchedules] = useState<ScheduleType[] | undefined>();
    

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
            }
        })
    }, [])

    return (
        <Container className="p-5 text-center">
            <h2 className="text-center mb-5">管理活動請求</h2>
            <div className="d-flex flex-column gap-3">
                <Table loading={schedules == null} columns={getScheduleColumn(naviage, true)} dataSource={schedules} className="w-100 text-center"></Table>
            </div>
        </Container>
    )
}

export default ManageScheduleRequest;