import { Tag } from "antd";
import UserAvatar from "../page/components/UserAvatar";
import { ScheduleType } from "../type/schedule/ScheduleType";
import { ClockCircleOutlined } from "@ant-design/icons";

export default function PendingTooltip(props: {
    schedule: ScheduleType
}) {
    const schedule = props.schedule;
    
    return (
        <div className="p-2 d-flex flex-column gap-2">
            <div className="d-flex flex-row gap-1">
                <UserAvatar account={schedule.user.account} size={22}></UserAvatar>
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