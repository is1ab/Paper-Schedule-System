import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { blockedUser, getSelfUserInfo, getUsers, unblockedUser } from "../store/dataApi/UserApiSlice";
import { useAppDispatch } from "../store/hook";
import { UserType } from "../type/user/userType";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button, Table } from "antd";
import { CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import UserAvatarButton from "../components/UserAvatarButton";

function ManageUser(){
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [self, setSelf] = useState<UserType | undefined>();
    const [userTableDatas, setUserTableDatas] = useState<UserType[]>()

    const columns = [
        {
            title: "帳號",
            dataIndex: "account",
            className: "text-center",
            key: "account",
            width: "16%"
        },
        {
            title: "名稱",
            dataIndex: "name",
            className: "text-center",
            key: "name",
            width: "16%",
            render: (_text: string, record: UserType, _index: number) => {
                return (
                    <UserAvatarButton user={record}></UserAvatarButton>
                )
            }
        },
        {
            title: "身份組",
            dataIndex: "role",
            className: "text-center",
            key: "role",
            width: "16%",
            render: (_text: string, record: UserType, _index: number) => {
                return <span>{record.roles.map((role) => role.name).join(", ")}</span>
            }
        },
        {
            title: "備註",
            dataIndex: "note",
            className: "text-center",
            key: "note",
            width: "16%"
        },
        {
            title: "帳號狀態",
            dataIndex: "status",
            className: "text-center",
            key: "status",
            width: "16%",
            render: (_text: string, record: UserType, _index: number) => {
                return (
                    <div>
                        { record.blocked ?
                            <div className="d-flex flex-row gap-1 justify-content-center" style={{color: 'red'}}>
                                <MinusCircleOutlined />
                                <span >已凍結</span>
                            </div> :
                            <div className="d-flex flex-row gap-1 justify-content-center" style={{color: 'green'}}>
                                <CheckCircleOutlined />
                                <span>可用</span>
                            </div> 
                        }
                    </div>
                )
            }
        },
        {
            title: "操作",
            dataIndex: "action",
            className: "text-center",
            key: "action",
            width: "16%",
            render: (_text: string, record: UserType, _index: number) => {
                const isAbleToBlock = () => {
                    return self?.account != record.account && record.roles.slice(-1)[0].name !== "Root"
                }
                const isAbleToEdit = () => {
                    return record.roles.slice(-1)[0].name !== "Root"
                }
                return self === undefined ? null : (
                    <div className="d-flex flex-row gap-3 justify-content-center">
                        { isAbleToEdit() ?
                            <Button type="primary" onClick={() => navigate(`/User/${record.account}/Edit`)}> 編輯帳號 </Button> :
                            null
                        }
                        { isAbleToBlock() ? 
                            <>
                            { !record.blocked ? 
                            <Button danger type="primary" onClick={() => blockUser(record.account)}> 凍結帳號 </Button> :
                            <Button danger type="primary" onClick={() => unblockUser(record.account)}> 解凍帳號 </Button>
                            } 
                            </> : null
                        }
                        
                    </div>
                )
            }
        }
    ]

    const blockUser = (account: string) => {
        if(userTableDatas === undefined){
            return
        }
        const user = userTableDatas.find(user => user.account == account)
        if(user === undefined){
            return
        }
        Swal.fire({
            icon: "question",
            title: `確認要凍結使用者 ${user.name}（${user.account}）嗎？`,
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
                        dispatch(blockedUser(user.account)).then((response) => {
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

    const unblockUser = (account: string) => {
        if(userTableDatas === undefined){
            return
        }
        const user = userTableDatas.find(user => user.account == account)
        if(user === undefined){
            return
        }
        Swal.fire({
            icon: "question",
            title: `確認要解凍使用者 ${user.name}（${user.account}）嗎？`,
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
                        dispatch(unblockedUser(user.account)).then((response) => {
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
                const users = (payload["data"] as UserType[]).sort((a, b) => {
                    const highestPermissionRoleA = a.roles.slice(-1)[0];
                    const highestPermissionRoleB = b.roles.slice(-1)[0];
                    return highestPermissionRoleA.id - highestPermissionRoleB.id;
                })
                setUserTableDatas(users)
            }
        })
    }

    useEffect(() => {
        refreshUsers()
    }, [])

    useEffect(() => {
        dispatch(getSelfUserInfo()).then((response) => {
            const payload = response.payload;
            const user = payload["data"] as UserType;
            setSelf(user);
        })
    }, [dispatch])

    return (
        <Container className="p-5">
            <h2 className="text-center pb-4">管理實驗室成員</h2>
            <div className="d-flex flex-column gap-4">
                <div className="d-flex flex-row justify-content-end">
                    <Button type="primary" className="w-25" onClick={() => navigate("/User/0/Edit")}>新增使用者</Button>
                </div> 
                <Table loading={userTableDatas === undefined} columns={columns} dataSource={userTableDatas} className="w-100 text-center"></Table>
            </div>
        </Container>
    )
}

export default ManageUser;