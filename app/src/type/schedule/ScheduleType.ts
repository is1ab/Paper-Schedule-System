import { HostRuleDataType } from "../host/HostRuleType"
import { UserType } from "../user/userType"

export interface AddSchedulePayloadType {
    name: string,
    link: string,
    description: string,
    attachments: AddScheduleAttachmentPayloadType[]
}

export interface AddScheduleAttachmentPayloadType {
    fileKey: string,
    realName: string
}

export interface ScheduleType {
    datetime: string,
    description: string,
    id: string,
    link: string,
    name: string,
    status: ScheduleStatusType,
    user: UserType,
    hostRule: HostRuleDataType | undefined,
    hostRuleIter: number
    attachments: ScheduleAttachmentType[]
}

export interface ScheduleStatusType {
    id: number,
    name: string
}

export interface ScheduleAttachmentType {
    id: number,
    virtualName: string,
    realName: string,
    type: string
}

export interface SpecificScheduleDatePayloadType {
    scheduleId: string,
    hostRuleId: number,
    iteration: number
}