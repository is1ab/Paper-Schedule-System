import { Dayjs } from "dayjs";

export interface HolidayRowType {
    [key: string]: any,
    id: number,
    date: string,
    reason: string,
    creator: string,
    expired: boolean,
    status: null | "EDIT"
}