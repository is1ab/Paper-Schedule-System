import { Container, Popover } from "react-bootstrap";
import { Avatar, Calendar, Tooltip, Whisper } from "rsuite";
import { useAppDispatch } from "../store/hook";
import { useEffect, useState } from "react";
import { getAllSchedule } from "../store/dataApi/ScheduleApiSlice";
import { ScheduleType } from "../type/schedule/ScheduleType";
import dayjs, { Dayjs } from "dayjs";
import Logo from "../assets/logo.png"

function Event(){
    const dispatch = useAppDispatch()
    const [ events, setEvents ] = useState<ScheduleType[]>([])

    useEffect(() => {
        dispatch(getAllSchedule()).then((response: any) => {
            if(response.meta.requestStatus == 'fulfilled'){
                const payload = response.payload;
                const data = payload["data"] as ScheduleType[];
                setEvents(data)
            }
        })
    }, [])

    const isSameDate = (date1: Dayjs, date2: Dayjs) => {
        return date1.isSame(date2, "date");
    }

    const renderCell = (date: Date) => {
        const dateEvents = events.filter((event) => event.datetime && isSameDate(dayjs(event.datetime), dayjs(date)));
        const displayEvents = dateEvents.filter((_item, index) => index < 2);
        
        if(dateEvents.length){
            const moreCount = dateEvents.length - displayEvents.length;
            const MoreItem = () => {
                return (
                    <div>
                        <Whisper
                            placement="top"
                            followCursor
                            speaker={
                                <Tooltip>
                                    {dateEvents.map((item, index) => {
                                            return (
                                                <p key={index}>
                                                    {item.user.name} - {item.name}
                                                </p>
                                            )
                                        })
                                    }
                                </Tooltip>
                            }
                        >
                            <a>查看其他 {moreCount} 項</a>
                        </Whisper>
                    </div>
                )
            }

            return (
                <div key={"date-cell-" + date.getDay()} className="">
                    {displayEvents.map((item, _index) => {
                        return (
                            <Whisper 
                                followCursor 
                                placement="top"
                                speaker={
                                    <Tooltip>
                                        <span>{item.user.name} - {item.name}</span>
                                    </Tooltip>
                                }
                            >
                                <div className="text-nowrap d-flex flex-row gap-1">
                                    <div>
                                        <Avatar src={Logo} size="xs" circle></Avatar>
                                    </div>
                                    <span><strong>{item.user.name}</strong> - {item.name}</span>
                                </div>
                            </Whisper>
                        )
                    })}
                    {moreCount ? <MoreItem></MoreItem> : null}
                </div>
            )
        }
        return null
    }

    return (
        <Container className="p-5 text-center">
            <h2 className="pb-4"> 近期活動 </h2>
            <Calendar bordered className="shadow rounded" renderCell={renderCell}></Calendar>
        </Container>
    )
}

export default Event;