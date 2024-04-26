import { Container } from "react-bootstrap";
import { useAppDispatch } from "../store/hook";
import { useEffect, useState } from "react";
import { getAllSchedule } from "../store/dataApi/ScheduleApiSlice";
import { ScheduleType } from "../type/schedule/ScheduleType";
import dayjs, { Dayjs } from "dayjs";
import { Calendar } from "antd";
import CalendarTask from "../components/CalendarTask";

function Event(){
    const dispatch = useAppDispatch()
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
                    specificEvents.map((specificEvent) => <CalendarTask schedule={specificEvent}/>)
                }
            </ul>
        )
    }

    return (
        <Container className="p-5 text-center">
            <h2 className="pb-4"> 近期活動 </h2>
            <Calendar cellRender={cellRender}></Calendar>
        </Container>
    )
}

export default Event;