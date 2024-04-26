import { Badge, Tooltip } from "antd";
import { ScheduleType } from "../type/schedule/ScheduleType";
import HolidayTooltip from "./HolidayTooltip";
import PendingTooltip from "./PendingTooltip";
import EventTooltip from "./EventTooltip";
import { useNavigate } from "react-router-dom";

export default function CalendarTask(props: {
    schedule: ScheduleType
}){
    const navigate = useNavigate()
    const schedule = props.schedule
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
            <li key={schedule.name} onClick={() => navigate(`/Schedule/${schedule.id}`)}>
                { schedule.user ? 
                    <Badge status="success" text={schedule.user.name + " - " + schedule.name}></Badge> :
                    <Badge status="success" text={schedule.name}></Badge>
                }
            </li>
        </Tooltip>
    )
}