import { Tag } from "antd";
import { ScheduleType } from "../type/schedule/ScheduleType";

export default function HolidayTooltip(props: {
    holiday: ScheduleType
}) {
    const holiday = props.holiday;
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