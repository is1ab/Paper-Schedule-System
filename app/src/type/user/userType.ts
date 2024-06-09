import { ScheduleType } from "../schedule/ScheduleType";
import { RoleType } from "../setting/RoleType";

export interface UserType {
    blocked: boolean,
    email: string,
    id: number,
    account: string,
    name: string,
    roles: RoleType[],
    note: string,
    weight: number,
    schedules: ScheduleType[]
}