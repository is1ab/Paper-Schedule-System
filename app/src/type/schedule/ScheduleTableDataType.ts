import { HostRuleDataType } from "../host/HostRuleType"
import { UserType } from "../user/userType"
import { ScheduleStatusType } from "./ScheduleType"

export interface ScheduleTableDataType {
    id: string,
    user: UserType | undefined
    name: string,
    status: ScheduleStatusType,
    hostrule: HostRuleDataType | undefined,
    action: string
}