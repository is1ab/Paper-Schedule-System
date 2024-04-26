import axios from "axios";
import { BaseService } from "./BaseService";
import { HostRulePayloadType } from "../../../type/host/HostRuleType";

export class HostRuleService extends BaseService {
    constructor (token: string | null = null){
        super(token)
    }
    
    addHostRule = (payload: HostRulePayloadType) => {
        return axios.post("/host/", payload, this.getAxiosRequestConfig())
    }

    getHostRules = () => {
        return axios.get("/host/", this.getAxiosRequestConfig())
    }
}