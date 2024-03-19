
import axios from "axios";
import { BaseService } from "./BaseService";
import { AddUserPayloadType, ModifyUserPayloadType } from "../../../type/user/userPayloadType";

export class UserService extends BaseService {
    constructor (token: string | null = null){
        super(token);
    }

    getUser = (userId: string) => {
        return axios.get(`/user/${userId}/userInfo`, this.getAxiosRequestConfig())
    }

    getUsers = () => {
        return axios.get("/user/", this.getAxiosRequestConfig())
    }

    addUser = (payload: AddUserPayloadType) => {
        return axios.post("/user/", { 
            id: payload.id,
            name: payload.name,
            role: payload.role,
            email: payload.email,
            note: payload.note
        }, this.getAxiosRequestConfig())
    }

    modifyUser = (user_id: string, payload: ModifyUserPayloadType) => {
        return axios.put(`/user/${user_id}`, { 
            name: payload.name,
            role: payload.role,
            email: payload.email,
            note: payload.note
        }, this.getAxiosRequestConfig())
    }

    blockUser = (user_id: string) => {
        return axios.post(`/user/${user_id}/blocked`, {}, this.getAxiosRequestConfig())
    }

    unblockUser = (user_id: string) => {
        return axios.post(`/user/${user_id}/unblocked`, {}, this.getAxiosRequestConfig())
    }

    getUserSelfInfo = () => {
        return axios.get("/user/self", this.getAxiosRequestConfig())
    }

    uploadAvatar = (content: Blob) => {
        return axios.post("/user/self/avatar", content, this.getAxiosImagePostRequestConfig(content.type))
    }

    getSelfAvatar = () => {
        return axios.get("/user/self/avatar", this.getAxiosImageGetRequestConfig())
    }

    getUserAvatar = (account: string) => {
        return axios.get(`/user/${account}/avatar`, this.getAxiosImageGetRequestConfig())
    }
}