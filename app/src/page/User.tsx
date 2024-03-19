import { Card, Container, Image } from "react-bootstrap";
import Logo from "../assets/logo.png"
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hook";
import { getSelfUserInfo } from "../store/dataApi/UserApiSlice";
import { UserType } from "../type/user/userType";
import dayjs from "dayjs";

function User(){
    const dispatch = useAppDispatch()
    const [ user, setUser ] = useState<UserType | undefined>()

    useEffect(() => {
        dispatch(getSelfUserInfo()).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                const payload = response.payload;
                const user = payload["data"] as UserType;
                setUser(user)
            }
        })
    }, [])
    
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

    return (
        <Container className="p-5 d-flex flex-row gap-5">
            { user && 
            <>
                <div className="d-flex flex-column gap-3 text-center">
                    <Image roundedCircle width={256} height={256} src={Logo} className="border"></Image>
                    <h2>{user?.name}</h2>
                    <div className="w-100">
                        <div className="border p-3 rounded d-flex flex-row gap-3">
                            <div className="w-100 d-flex flex-column gap-1">
                                <div className="bg-primary p-3 w-100 text-white fs-2">
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
                <div className="w-75 p-3">
                    <div className="w-100 p-3 rounded border">
                        <div>
                            <h2 className="pt-3">待審核活動</h2>
                            <div className="d-flex flex-column py-3 gap-3">
                                { getUserPendingSchedule().map((schedule) => {
                                        return (
                                            <Card className="p-3 d-flex flex-row gap-3">
                                                <div className="d-flex flex-column text-start">
                                                    <span className="fs-5 font-bold">{schedule.name}</span>
                                                    <span><a href={schedule.link} target="_blank">{schedule.link}</a></span>
                                                </div>
                                            </Card>
                                        )
                                    }
                                )}
                            </div>
                        </div>
                        <hr></hr>
                        <div>
                            <h2 className="pt-3">已安排活動</h2>
                            <div className="d-flex flex-column py-3 gap-3">
                                { getUserArrangedSchedule().map((schedule) => {
                                        return (
                                            <Card className="p-3 d-flex flex-row gap-3">
                                                <div className="d-flex flex-column text-start">
                                                    <span className="fs-5 font-bold">{schedule.name}</span>
                                                    <span><a href={schedule.link} target="_blank">{schedule.link}</a></span>
                                                    <span><small>{dayjs(schedule.datetime).format("YYYY/MM/DD")}</small></span>
                                                </div>
                                            </Card>
                                        )
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </div> 
            </>
            }
        </Container>
    )
}

export default User;