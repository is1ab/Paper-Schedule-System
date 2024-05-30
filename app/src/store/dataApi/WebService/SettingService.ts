import axios from "axios";
import { BaseService } from "./BaseService";

export class SettingService extends BaseService {
    constructor (token: string | null = null){
        super(token);
    }

    getRoles = () => {
        return axios.get("/setting/role", this.getAxiosRequestConfig())
    }

    getAnnouncments = () => {
        return axios.get("/setting/announcement", this.getAxiosRequestConfig())
    }

    getSystemArgs = () => {
        return axios.get("/setting/system_arg", this.getAxiosRequestConfig())
    }
}