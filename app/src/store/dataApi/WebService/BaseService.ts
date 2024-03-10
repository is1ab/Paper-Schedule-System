import { AxiosRequestConfig } from "axios";

export class BaseService {
    _token: string | null;

    constructor(token: string | null){
        this._token = token;
    }

    getAxiosRequestConfig = () => {
        const config: AxiosRequestConfig = {
            baseURL: `/api/`,
        };

        if (this._token !== null && this._token !== "") {
            config.headers = { Authorization: "Bearer " + this._token };
        }

        return config;
    }
}