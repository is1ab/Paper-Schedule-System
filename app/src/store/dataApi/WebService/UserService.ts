
import axios from "axios";
import { BaseService } from "./BaseService";

export class UserService extends BaseService {
    constructor (token: string | null = null){
        super(token);
    }

    getUsers = () => {
        return axios.get("/user/", this.getAxiosRequestConfig())
    }

    getUserSelfInfo = () => {
        return axios.get("/user/userInfo", this.getAxiosRequestConfig())
    }
}