import { Container } from "react-bootstrap";
import { useAppDispatch } from "../store/hook";
import { useEffect, useState } from "react";
import { getAllSchedule } from "../store/dataApi/ScheduleApiSlice";
import { ScheduleType } from "../type/schedule/ScheduleType";
import dayjs, { Dayjs } from "dayjs";
import UserAvatar from "./components/UserAvatar";
import { useNavigate } from "react-router-dom";
import { Badge, Calendar, Tag, Tooltip } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

function Event(){
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
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

    const EventTooltip = (schedule: ScheduleType) => {
        return (
            <div className="p-2 d-flex flex-column gap-2">
                { schedule.user &&
                    <div className="d-flex flex-row gap-1">
                        <UserAvatar account={schedule.user.account} size="xs"></UserAvatar>
                        <span className="my-auto">{schedule.user.name}</span>
                    </div>
                }
                <div className="d-flex flex-column gap-1">
                    <Tag color="default">實驗室例行會議</Tag>
                    <Tag icon={<CheckCircleOutlined />} color="green">已完成審核</Tag>
                </div>
                <div className="d-flex flex-row gap-3">
                    <span>{schedule.name}</span>
                </div>
            </div>
        )
    }

    const HolidayTooltip = (holiday: ScheduleType) => {
        return (
            <div className="p-2 d-flex flex-column gap-2">
                <div className="d-flex flex-column gap-1">
                    <Tag color="error">假期</Tag>
                </div>
                <div className="d-flex flex-row gap-3">
                    <span>{holiday.name}</span>
                </div>
            </div>
        )
    }

    const PendingTooltip = (schedule: ScheduleType) => {
        return (
            <div className="p-2 d-flex flex-column gap-2">
                <div className="d-flex flex-row gap-1">
                    <UserAvatar account={schedule.user.account} size="xs"></UserAvatar>
                    <span className="my-auto">{schedule.user.name}</span>
                </div>
                <div className="d-flex flex-column gap-1">
                    <Tag color="default">{schedule.hostRule?.name}</Tag>
                    <Tag icon={<ClockCircleOutlined />} color="default">等待規劃中</Tag>
                </div>
                <div className="d-flex flex-row gap-3">
                    <span style={{color: "#BBBBBB"}}>暫無會議議程</span>
                </div>
            </div>
        )
    }

    const cellRender = (date: Dayjs, _info: any) => {
        const specificEvents = events.filter((event) => 
            dayjs(event.datetime).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
        )
        return (
            <ul className="events">
                {
                    specificEvents.map((specificEvent) => {
                        if(specificEvent.status.id == 5){
                            return (
                                <Tooltip placement="right" title={HolidayTooltip(specificEvent)}>
                                    <li key={specificEvent.name}>
                                        <Badge status="error" text={`活動暫停：${specificEvent.name}`}></Badge>
                                    </li>
                                </Tooltip>
                            )
                        }
                        if(specificEvent.status.id == 4){
                            return (
                                <Tooltip placement="right" title={PendingTooltip(specificEvent)}>
                                    <li key={specificEvent.name}>
                                        <Badge status="processing" text={`${specificEvent.user.name} - ${specificEvent.hostRule?.name}`}></Badge>
                                    </li>
                                </Tooltip>
                            )
                        }
                        return (
                            <Tooltip placement="right" title={EventTooltip(specificEvent)}>
                                <li key={specificEvent.name} onClick={() => navigate(`/Schedule/${specificEvent.id}`)}>
                                    { specificEvent.user ? 
                                        <Badge status="success" text={specificEvent.user.name + " - " + specificEvent.name}></Badge> :
                                        <Badge status="success" text={specificEvent.name}></Badge>
                                    }
                                </li>
                            </Tooltip>
                        )
                    })
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