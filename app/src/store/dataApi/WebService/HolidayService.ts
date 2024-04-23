import axios from "axios";
import { BaseService } from "./BaseService";
import { HolidayAddPayload } from "../../../type/holiday/HolidayPayload";

export class HolidayService extends BaseService {
    constructor (token: string | null = null){
        super(token)
    }
    
    addHoliday = (payload: HolidayAddPayload) => {
        return axios.post("/holiday/", {
            name: payload.name,
            date: payload.date.format("YYYY-MM-DD")
        }, this.getAxiosRequestConfig())
    }

    getHolidays = () => {
        return axios.get("/holiday/", this.getAxiosRequestConfig())
    }

    deleteHoliday = (date: string) => {
        return axios.delete(`/holiday/${date}/`, this.getAxiosRequestConfig())
    }
}