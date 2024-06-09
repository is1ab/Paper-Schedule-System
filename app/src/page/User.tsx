import { Button, Container, Image } from "react-bootstrap";
import Logo from "../assets/logo.png"
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../store/hook";
import { getSelfUserInfo, getUser, getUserAvatar, uploadAvatar } from "../store/dataApi/UserApiSlice";
import { UserType } from "../type/user/userType";
import Is1abAvatarEditor from "./components/AvatarEditor";
import Swal from "sweetalert2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Table } from "antd";
import { getScheduleColumn } from "../columns/ScheduleColumns";
import { FileOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";

function User(){
    const { state } = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { userId } = useParams()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [ user, setUser ] = useState<UserType | undefined>()
    const [ selfUser, setSelfUser ] = useState<UserType | undefined>()
    const [ avatarFile, setAvatarFile ] = useState<File | null>();
    const [ avatar, setAvatar ] = useState<string | undefined>(Logo) 
    const [ isShowAvatarEditor, setIsShowAvatarEditor ] = useState<boolean>(false);
    const showAvatarEditor = () => setIsShowAvatarEditor(true)
    const hideAvatarEditor = () => {
        if(fileInputRef.current == null){
            return;
        }
        fileInputRef.current.value = ""
        setIsShowAvatarEditor(false)
    }

    useEffect(() => {
        if(userId == undefined){
            return
        }
        dispatch(getUser(userId)).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                const payload = response.payload;
                const user = payload["data"] as UserType;
                setUser(user)
            }
        })
    }, [userId])

    const fetchSelfUserInfo = () => {
        dispatch(getSelfUserInfo()).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                const payload = response.payload
                const user = payload["data"] as UserType
                setSelfUser(user)
            }
        })
    }

    const getUserUnarrangedSchedule = () => {
        if(user == undefined){
            return []
        }
        return user.schedules.filter((schedule) => schedule.status.id === 4)
    }
    
    const getUserPendingSchedule = () => {
        if(user == undefined){
            return []
        }
        return user.schedules.filter((schedule) => schedule.status.id === 1)
    }

    const getUserArrangedSchedule = () => {
        if(user == undefined){
            return []
        }
        return user.schedules.filter((schedule) => schedule.status.id === 2)
    }

    useEffect(() => {
        if(userId == undefined){
            return
        }
        dispatch(getUserAvatar(userId)).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                const payload = response.payload as Blob;
                setAvatar(URL.createObjectURL(payload))
            }else{
                setAvatar(Logo)
            }
        })
    }, [dispatch, userId, state])

    const handleUpload = () => {
        if(fileInputRef.current == null){
            return;
        }
        fileInputRef.current.click()
    }

    const handleInputFileOnChange = () => {
        if(fileInputRef.current == null){
            return;
        }
        const files = fileInputRef.current.files;
        if(files == null){
            return;
        }
        setAvatarFile(files.item(0))
        showAvatarEditor()
    }

    const handleSubmitAvatar = async (avatar: Blob) => {
        dispatch(uploadAvatar(avatar)).then((response) => {
            if(response.meta.requestStatus === "fulfilled"){
                Swal.fire({
                    icon: "success",
                    title: "上傳成功",
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.reload();
                })
            }
        })
    }

    useEffect(() => {
        fetchSelfUserInfo()
    }, [])

    return (
        <>
            <Container className="p-5 d-flex flex-row gap-5">
                { user && 
                <>
                    <div className="d-flex flex-column gap-3 text-center">
                        <div className="w-100">
                            { selfUser?.account == userId ?
                            <>
                                <input 
                                    ref={fileInputRef} 
                                    type='file' 
                                    onChange={() => handleInputFileOnChange()}
                                    accept="image/png, image/jpeg"
                                    hidden
                                ></input>
                                <Button 
                                    style={{ width: 250, height: 250, borderRadius: "100%" }} 
                                    variant="btn-outline-secondary" 
                                    className="border p-0"
                                    onClick={() => handleUpload()}
                                >
                                    <Image roundedCircle src={avatar} width="100%" height="100%"></Image>
                                </Button>
                            </> :
                            <>
                                 <Button 
                                    style={{ width: 250, height: 250, borderRadius: "100%", cursor: "default" }} 
                                    variant="btn-outline-secondary" 
                                    className="border p-0"
                                >
                                    <Image roundedCircle src={avatar} width="100%" height="100%"></Image>
                                </Button>
                            </> 
                            }
                        </div>
                        <h2>{user?.name}</h2>
                        <div className="w-100">
                            <div className="border p-4 rounded d-flex flex-column gap-2">
                                <div className="d-flex flex-row gap-3">
                                    <MailOutlined></MailOutlined>
                                    <span>{user.email}</span>
                                </div>
                                <div className="d-flex flex-row gap-3">
                                    <UserOutlined></UserOutlined>
                                    <span>{user.roles.map((role) => role.name).join(", ")}</span>
                                </div>
                                <div className="d-flex flex-row gap-3">
                                    <FileOutlined></FileOutlined>
                                    <span>{user.note}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-100">
                            <div className="border p-3 rounded d-flex flex-row gap-3">
                                <div className="w-100 d-flex flex-column gap-1">
                                    <div className="bg-danger p-3 w-100 text-white fs-2">
                                        <span>{ getUserUnarrangedSchedule().length }</span>
                                    </div>
                                    <span>等待安排</span>
                                </div>
                                <div className="w-100 d-flex flex-column gap-1">
                                    <div className="bg-secondary p-3 w-100 text-white fs-2">
                                        <span>{ getUserPendingSchedule().length }</span>
                                    </div>
                                    <span>待審核</span>
                                </div>
                                <div className="w-100 d-flex flex-column gap-1">
                                    <div className="bg-success p-3 w-100 text-white fs-2">
                                        <span>{ getUserArrangedSchedule().length }</span>
                                    </div>
                                    <span>已安排</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Card title="個人活動" className="w-100">
                        <Table columns={getScheduleColumn(navigate).filter((prop) => prop.key != "user")} dataSource={user.schedules} pagination={{pageSize: 5}}></Table>
                    </Card>
                </>
                }
            </Container>
            <Is1abAvatarEditor 
                show={isShowAvatarEditor} 
                handleHide={hideAvatarEditor} 
                setAvatar={setAvatar} 
                avatarFile={avatarFile}
                onSubmit={handleSubmitAvatar}
            >    
            </Is1abAvatarEditor>
        </>
    )
}

export default User;