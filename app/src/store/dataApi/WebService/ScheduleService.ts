
import axios from "axios";
import { BaseService } from "./BaseService";

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
}