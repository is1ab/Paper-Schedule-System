import { AxiosRequestConfig } from "axios";

export class BaseService {
    _token: string | null;

    constructor(token: string | null){
        this._token = token;
    }

    getAxiosRequestConfig = (isPDF: boolean = false) => {
        const config: AxiosRequestConfig = {
            baseURL: `/api/`,
        };

        if (this._token !== null && this._token !== "") {
            config.headers = { Authorization: "Bearer " + this._token };
        }

        if (isPDF){
            config.headers = { ...config.headers, "Content-Type": "application/pdf"}
        }

        return config;
    }

    getAxiosImagePostRequestConfig = (contentType: string) => {
        const config = this.getAxiosRequestConfig();
        config.headers = { ...config.headers, "Content-Type": contentType}
        return config;
    }

    getAxiosImageGetRequestConfig = () => {
        const config = this.getAxiosRequestConfig();
        config.responseType = "blob"
        config.headers = { ...config.headers, "Content-Type": "image/png"}
        return config;
    }
}