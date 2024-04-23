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
import { getHolidays } from "../store/dataApi/HolidayApiSlice";
import { HolidayDataType } from "../type/holiday/HolidayPayload";

function Event(){
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [ events, setEvents ] = useState<ScheduleType[]>([])
    const [ holidays, setHolidays ] = useState<HolidayDataType[]>([])

    useEffect(() => {
        dispatch(getAllSchedule()).then((response: any) => {
            if(response.meta.requestStatus == 'fulfilled'){
                const payload = response.payload;
                const data = payload["data"] as ScheduleType[];
                setEvents(data.filter((d) => d.status.id == 1))
            }
        })
    }, [])

    useEffect(() => {
        dispatch(getHolidays()).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                const payload = response.payload;
                const datas = payload["data"] as HolidayDataType[]
                setHolidays(datas)
            }
        })
    }, [])

    const EventTooltip = (schedule: ScheduleType) => {
        return (
            <div className="p-2 d-flex flex-column gap-2">
                <div className="d-flex flex-row gap-1">
                    <UserAvatar account={schedule.user.account} size="xs"></UserAvatar>
                    <span className="my-auto">{schedule.user.name}</span>
                </div>
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

    const HolidayTooltip = (holiday: HolidayDataType) => {
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
                    <Tag color="default">Windows API Call 專題會議</Tag>
                    <Tag icon={<ClockCircleOutlined />} color="default">題目未定或等待審核中</Tag>
                </div>
            </div>
        )
    }

    const cellRender = (date: Dayjs, _info: any) => {
        const specificEvents = events.filter((event) => dayjs(event.datetime).format("YYYY-MM-DD") === date.format("YYYY-MM-DD"))
        const specificHolidays = holidays.find((holiday) => holiday.date === date.format("YYYY-MM-DD"))
        if(specificHolidays !== undefined){
            return (
                <Tooltip placement="right" open={false} title={HolidayTooltip(specificHolidays)}>
                    <li key={specificHolidays.name}>
                        <Badge status="error" text={`假期：${specificHolidays.name}`}></Badge>
                    </li>
                </Tooltip>
            )
        }
        return (
            <ul className="events">
                {
                    specificEvents.map((specificEvent) => {
                        return (
                            <Tooltip placement="right" title={EventTooltip(specificEvent)}>
                                <li key={specificEvent.name} onClick={() => navigate(`/Schedule/${specificEvent.id}`)}>
                                    <Badge status="success" text={specificEvent.user.name + " - " + specificEvent.name}></Badge>
                                </li>
                            </Tooltip>
                        )
                    })
                }
                {
                    specificEvents.map((specificEvent) => {
                        return (
                            <Tooltip placement="right" title={PendingTooltip(specificEvent)}>
                                <li key={specificEvent.name} onClick={() => navigate(`/Schedule/${specificEvent.id}`)}>
                                    <Badge status="processing" text={"黃漢軒 - 待定"}></Badge>
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