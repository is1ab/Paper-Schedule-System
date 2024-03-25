
import axios from "axios";
import { BaseService } from "./BaseService";
import { AddSchedulePayloadType } from "../../../type/schedule/ScheduleType";

export class ScheduleService extends BaseService {
    constructor (token: string | null = null){
        super(token);
    }

    check_duplicate_url = (url: string) => {
        return axios.post("/schedule/check/duplicate_url", {
            url: url
        }, this.getAxiosRequestConfig());
    }

    upload_attachment = (formData: FormData) => {
        return axios.post("/schedule/upload_attachment", formData, this.getAxiosRequestConfig(true))
    }

    add_schedule = (payload: AddSchedulePayloadType) => {
        return axios.post("/schedule/", payload, this.getAxiosRequestConfig())
    }

    get_all_schedule = () => {
        return axios.get("/schedule/", this.getAxiosRequestConfig())
    }

    getSchedule = (scheduleId: string) => {
        return axios.get(`/schedule/${scheduleId}`, this.getAxiosRequestConfig())
    }
}