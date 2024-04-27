import { Container } from "react-bootstrap";
import { useAppDispatch } from "../store/hook";
import { useEffect, useState } from "react";
import { getAllSchedule } from "../store/dataApi/ScheduleApiSlice";
import { ScheduleType } from "../type/schedule/ScheduleType";
import dayjs, { Dayjs } from "dayjs";
import { Badge, Calendar, Tooltip, message } from "antd";
import HolidayTooltip from "../components/HolidayTooltip";
import PendingTooltip from "../components/PendingTooltip";
import EventTooltip from "../components/EventTooltip";
import { useNavigate } from "react-router-dom";

function Event(){
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [ events, setEvents ] = useState<ScheduleType[]>([])

    useEffect(() => {
        dispatch(getAllSchedule()).then((response: any) => {
            if(response.meta.requestStatus == 'fulfilled'){
                const payload = response.payload;
                const datas= payload["data"] as ScheduleType[];
                setEvents(datas.filter((data => data.status.id === 2 || data.status.id === 4 || data.status.id === 5)))
            }
        })
    }, [])

    const cellRender = (date: Dayjs, _info: any) => {
        const specificEvents = events.filter((event) => 
            dayjs(event.datetime).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
        )
        return (
            <ul className="events">
                {
                    specificEvents.map((schedule) => {
                        if(schedule.status.id == 5){
                            return (
                                <Tooltip placement="right" title={<HolidayTooltip holiday={schedule} />}>
                                    <li key={schedule.name}>
                                        <Badge status="error" text={`活動暫停：${schedule.name}`}></Badge>
                                    </li>
                                </Tooltip>
                            )
                        }
                        if(schedule.status.id == 4){
                            return (
                                <Tooltip placement="right" title={<PendingTooltip schedule={schedule}/>}>
                                    <li key={schedule.name}>
                                        <Badge status="processing" text={`${schedule.user.name} - ${schedule.hostRule?.name}`}></Badge>
                                    </li>
                                </Tooltip>
                            )
                        }
                        return (
                            <Tooltip placement="right" title={<EventTooltip schedule={schedule} />}>
                                <li key={schedule.name} onClick={() => {
                                    if(schedule.hostRule?.rule == "ALL"){
                                        messageApi.open({
                                            type: "error",
                                            content: "暫時不支援呈現非主持人輪替之活動"
                                        })
                                        return null
                                    }
                                    return navigate(`/Schedule/${schedule.id}`)
                                }}>
                                    { schedule.user ? 
                                        <Badge status="success" text={schedule.user.name + " - " + schedule.name}></Badge> :
                                        <Badge status="success" text={schedule.name}></Badge>
                                    }
                                </li>
                            </Tooltip>
                        )
                    })
                }
            </ul>
        )
    }

    return <>
        {contextHolder}
        <Container className="p-5 text-center">
            <h2 className="pb-4"> 近期活動 </h2>
            <Calendar cellRender={cellRender}></Calendar>
        </Container>
    </>
}

export default Event;