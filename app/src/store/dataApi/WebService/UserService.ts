
import axios from "axios";
import { BaseService } from "./BaseService";

export class UserService extends BaseService {
    constructor (token: string | null = null){
        super(token);
    }

    getUserSelfInfo = () => {
        return axios.get("/user/userInfo", this.getAxiosRequestConfig())
    }
}