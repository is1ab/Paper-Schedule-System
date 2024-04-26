
import axios from "axios";
import { BaseService } from "./BaseService";
import { SpecificScheduleDatePayloadType } from "../../../type/schedule/ScheduleType";

export class ScheduleAdminService extends BaseService {
    constructor (token: string | null = null){
        super(token);
    }

    specific_schedule_date = (payload: SpecificScheduleDatePayloadType) => {
        return axios.post(`/admin/schedule/${payload.scheduleId}/specificDate`, payload, this.getAxiosRequestConfig())
    }
}