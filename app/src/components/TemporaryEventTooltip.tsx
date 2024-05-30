import { Tag } from "antd";
import { ScheduleType } from "../type/schedule/ScheduleType";

export default function TemporaryEventTooltip(props: {
    schedule: ScheduleType
}) {
    const schedule = props.schedule;
    return (
        <div className="p-2 d-flex flex-column gap-2">
            <div className="d-flex flex-column gap-1">
                <Tag color="default">{schedule.hostRule?.name}</Tag>
                <Tag color="error">臨時事件</Tag>
            </div>
            <div className="d-flex flex-row gap-3">
                <span>{schedule.name}</span>
            </div>
            <div className="d-flex flex-row gap-3">
                <span style={{color: "#bbbbbb"}}>{schedule.description}</span>
            </div>
        </div>
    )
}