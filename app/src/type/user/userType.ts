import { ScheduleType } from "../schedule/ScheduleType";
import { RoleType } from "../setting/RoleType";

export interface UserType {
    blocked: boolean,
    email: string,
    id: string,
    account: string,
    name: string,
    role: RoleType,
    note: string,
    schedules: ScheduleType[]
}