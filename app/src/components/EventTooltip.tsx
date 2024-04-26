import { Tag } from "antd";
import UserAvatar from "../page/components/UserAvatar";
import { ScheduleType } from "../type/schedule/ScheduleType";
import { CheckCircleOutlined } from "@ant-design/icons";

export default function EventTooltip(props: {
    schedule: ScheduleType
}){
    const schedule = props.schedule;
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