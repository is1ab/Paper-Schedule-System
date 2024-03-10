
import axios from "axios";
import { BaseService } from "./BaseService";

export class AuthService extends BaseService {
    constructor (token: string | null = null){
        super(token);
    }

    login = (account: string, password: string) => {
        return axios.post("/auth/login", {
            account: account, 
            password: password
        }, this.getAxiosRequestConfig());
    }
}