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
                <Tag color="default">{schedule.hostRule?.name}</Tag>
                <Tag icon={<CheckCircleOutlined />} color="green">{schedule.status.name}</Tag>
            </div>
            <div className="d-flex flex-row gap-3">
                <span>{schedule.name}</span>
            </div>
            <div className="d-flex flex-row gap-3">
                { schedule.hostRule?.rule == "ALL" ?
                    <span style={{color: "#bbbbbb"}}>無法點擊，暫時不支援呈現非主持人輪替活動</span> :
                    <span style={{color: "#bbbbbb"}}>點擊來查看活動詳細資訊</span>
                }
            </div>
        </div>
    )
}