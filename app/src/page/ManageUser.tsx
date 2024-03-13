import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { blockedUser, getUsers, unblockedUser } from "../store/dataApi/UserApiSlice";
import { useAppDispatch } from "../store/hook";
import { UserType } from "../type/user/userType";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { RoleType } from "../type/setting/RoleType";
import { getRoles } from "../store/dataApi/SettingApiSlice";

function ManageUser(){
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [users, setUsers] = useState<UserType[]>([]);
    const [roles, setRoles] = useState<RoleType[]>([]);

    const blockUser = (user_id: string, name: string) => {
        Swal.fire({
            icon: "question",
            title: `確認要凍結使用者 ${name}（${user_id}）嗎？`,
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonColor: "#0d6efd",
            confirmButtonText: "確認",
            denyButtonColor: "#dc3545",
            denyButtonText: "取消"
        }).then((result) => {
            if(result.isConfirmed){
                Swal.fire({
                    title: "正在凍結...",
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading()
                        dispatch(blockedUser(user_id)).then((response) => {
                            if(response.meta.requestStatus === 'fulfilled'){
                                Swal.fire({
                                    icon: "success",
                                    title: "凍結成功",
                                    timer: 2000,
                                    showConfirmButton: false
                                }).then(() => {
                                    refreshUsers()
                                })
                            }
                        })
                        Swal.close()
                    }
                })
            }
        })
    }

    const unblockUser = (user_id: string, name: string) => {
        Swal.fire({
            icon: "question",
            title: `確認要解凍使用者 ${name}（${user_id}）嗎？`,
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonColor: "#0d6efd",
            confirmButtonText: "確認",
            denyButtonColor: "#dc3545",
            denyButtonText: "取消"
        }).then((result) => {
            if(result.isConfirmed){
                Swal.fire({
                    title: "正在解凍...",
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading()
                        dispatch(unblockedUser(user_id)).then((response) => {
                            if(response.meta.requestStatus === 'fulfilled'){
                                Swal.fire({
                                    icon: "success",
                                    title: "解凍成功",
                                    timer: 2000,
                                    showConfirmButton: false
                                }).then(() => {
                                    refreshUsers()
                                })
                            }
                        })
                        Swal.close()
                    }
                })
            }
        })
    }

    const refreshUsers = () => {
        dispatch(getUsers()).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                const payload = response.payload;
                const users = payload["data"] as UserType[]
                setUsers(users)
            }
        })
    }

    useEffect(() => {
        dispatch(getRoles()).then((response) => {
            if(response.meta.requestStatus == "fulfilled"){
                const payload = response.payload;
                const roles = payload["data"] as RoleType[]
                setRoles(roles)
            }
        })
    }, [])

    useEffect(() => {
        refreshUsers()
    }, [])

    const UserRow = (props: {
        data: UserType
    }) => {
        const data = props.data;
        return (
            <tr style={{verticalAlign: "middle"}}>
                <td>{data.account}</td>
                <td>{data.name}</td>
                <td>{data.role.name}</td>
                <td>{data.note}</td>
                <td>{data.blocked ? "已凍結" : "可用"}</td>
                <td className="d-flex flex-row gap-2 justify-content-center">
                    <Button variant={"success"} onClick={() => navigate(`/User/${data.account}/Edit`)}>編輯帳號</Button>
                    { data.blocked ?
                        <Button variant={"warning"} onClick={() => unblockUser(data.account, data.name)}>解凍帳號</Button> :
                        <Button variant={"danger"} onClick={() => blockUser(data.account, data.name)}>凍結帳號</Button>
                    }
                </td>
            </tr>
        )
    }

    return (
        <Container className="p-5">
            <h2 className="text-center pb-4">管理使用者</h2>
            <div className="d-flex flex-column gap-4">
                <div className="d-flex flex-row justify-content-end">
                    <Button className="w-25" onClick={() => navigate("/User/0/Edit")}>新增使用者</Button>
                </div> 
                <Table bordered hover className="w-100 text-center">
                    <thead>
                        <tr>
                            <th> 帳號 </th>
                            <th> 名稱 </th>
                            <th> 身份組 </th>
                            <th> 備註 </th>
                            <th> 帳號狀態 </th>
                            <th> 使用者操作 </th>
                        </tr>
                    </thead>
                    <tbody>
                    <>
                    {
                        roles.map((role: RoleType) => {
                            return (
                                <>
                                {
                                    users.filter((user) => user.role.id == role.id).map((user) => {
                                        return (
                                            <UserRow data={user}/>
                                        )
                                    })
                                }
                                </>
                            )
                        })
                    }
                    </>
                    </tbody>
                </Table>
            </div>
        </Container>
    )
}

export default ManageUser;