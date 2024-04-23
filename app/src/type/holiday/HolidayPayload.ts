import { Dayjs } from "dayjs"

export type HolidayAddPayload = {
    name: string,
    date: Dayjs
}

export type HolidayDataType = {
    id: number,
    name: string | undefined,
    date: string | undefined
}