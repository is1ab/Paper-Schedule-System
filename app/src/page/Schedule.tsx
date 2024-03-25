import { Card, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faFloppyDisk, faLink, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hook";
import { getSchedule } from "../store/dataApi/ScheduleApiSlice";
import { ScheduleType } from "../type/schedule/ScheduleType";
import dayjs from "dayjs";

function Schedule(){
    const dispatch = useAppDispatch()
    const { scheduleId } = useParams()
    const [ schedule, setSchedule ] = useState<ScheduleType | null>(null);

    useEffect(() => {
        if(scheduleId == null){
            return
        }
        dispatch(getSchedule(scheduleId)).then((response: any) => {
            const payload = response.payload;
            const schedule = payload["data"] as ScheduleType;
            setSchedule(schedule)
        })
    }, [scheduleId])

    return (
        <Container className="p-5">
            <h2 className="text-center mb-5">活動資訊</h2>
            <div className="d-flex flex-column gap-3">
                { schedule && 
                    <>
                        <Card className="p-5 fs-3 text-left">
                            <strong><p className="my-0">{schedule.name}</p></strong>
                        </Card>
                        <div className="w-100 d-flex flex-row gap-5">
                            <div className="w-50">
                                <div className="">
                                    <h5 className="text-center mb-3">詳細資訊</h5>
                                    <Card className="p-4">
                                        <div className="py-3 d-flex flex-row gap-5">
                                            <div className="w-25 d-flex flex-row justify-content-end">
                                                <FontAwesomeIcon size="xl" width={21} icon={faUser} className="my-auto w-fit-content text-primary"></FontAwesomeIcon>
                                            </div>
                                            <div className="w-100 d-flex flex-row justify-content-start">
                                                <p className="my-0 w-100 text-left">{schedule.user.name} &lt;{schedule.user.email}&gt; </p>
                                            </div>
                                        </div>
                                        <div className="py-3 d-flex flex-row gap-5">
                                            <div className="w-25 d-flex flex-row justify-content-end">
                                                <FontAwesomeIcon size="xl" width={21} icon={faCalendar} className="my-auto w-fit-content text-primary"></FontAwesomeIcon>
                                            </div>
                                            <div className="w-100 d-flex flex-row justify-content-start">
                                                <p className="my-0 w-100 text-left">{schedule.datetime == null ? "等待審核後配置" : dayjs(schedule.datetime).format("YYYY/MM/DD")}</p>
                                            </div>
                                        </div>
                                        <div className="py-3 d-flex flex-row gap-5">
                                            <div className="w-25 d-flex flex-row justify-content-end">
                                                <FontAwesomeIcon size="xl" width={21} icon={faLink} className="my-auto w-fit-content text-primary"></FontAwesomeIcon>
                                            </div>
                                            <div className="w-100 d-flex flex-row justify-content-start">
                                                <p className="my-0 w-100 text-left">{schedule.link}</p>
                                            </div>
                                        </div>
                                        {
                                            schedule.attachments.map((attachment) => {
                                                return (
                                                    <div className="py-3 d-flex flex-row gap-5">
                                                        <div className="w-25 d-flex flex-row justify-content-end">
                                                            <FontAwesomeIcon size="xl" icon={faFloppyDisk} className="my-auto w-fit-content text-primary"></FontAwesomeIcon>
                                                        </div>
                                                        <div className="w-100 d-flex flex-row justify-content-start">
                                                            <p className="my-0 w-100 text-left">{attachment.realName}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </Card>
                                </div>
                            </div>
                            <div className="w-50">
                                <h5 className="text-center mb-3">日誌</h5>
                                <Card className="p-5">
                                    <div className="ms-5 border-start border-info border-4 p-3 d-flex flex-row gap-5">
                                        <div className="rounded-circle bg-info my-auto" style={{width: "14px", height: "14px", marginLeft: "-24.5161px"}}></div>
                                        <p className="my-0"> 活動已建立</p>
                                    </div>
                                    <div className="ms-5 border-start border-info border-4 p-3 d-flex flex-row gap-5">
                                        <div className="rounded-circle bg-info my-auto" style={{width: "14px", height: "14px", marginLeft: "-24.5161px"}}></div>
                                        <p className="my-0"> 活動已審核通過 </p>
                                    </div>
                                    <div className="ms-5 border-start border-info border-4 p-3 d-flex flex-row gap-5">
                                        <div className="rounded-circle bg-info my-auto" style={{width: "14px", height: "14px", marginLeft: "-24.5161px"}}></div>
                                        <p className="my-0"> 完成發信提醒 </p>
                                    </div>
                                    <div className="ms-5 border-start border-info border-4 p-3 d-flex flex-row gap-5">
                                        <div className="rounded-circle bg-info my-auto" style={{width: "14px", height: "14px", marginLeft: "-24.5161px"}}></div>
                                        <p className="my-0"> 活動已開始 </p>
                                    </div>
                                    <div className="ms-5 border-start border-info border-4 p-3 d-flex flex-row gap-5">
                                        <div className="rounded-circle bg-info my-auto" style={{width: "14px", height: "14px", marginLeft: "-24.5161px"}}></div>
                                        <p className="my-0"> 活動已結束 </p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </>
                }
            </div>
        </Container>
    )
}

export default Schedule;