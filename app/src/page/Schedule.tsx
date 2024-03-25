import { Button, Card, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faCalendar, faFloppyDisk, faLink, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hook";
import { getSchedule } from "../store/dataApi/ScheduleApiSlice";
import { ScheduleType } from "../type/schedule/ScheduleType";
import dayjs from "dayjs";

function Schedule(props: {
    reviewMode: boolean
}){
    const dispatch = useAppDispatch()
    const reviewMode = props.reviewMode;
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

    const DetailItem = (props: {
        icon: IconDefinition,
        text: string
    }) => {
        const icon = props.icon;
        const text = props.text;
        return (
            <div className="py-3 d-flex flex-row gap-5">
                <div className="w-25 d-flex flex-row justify-content-end">
                    <FontAwesomeIcon size="xl" width={21} icon={icon} className="my-auto w-fit-content text-primary"></FontAwesomeIcon>
                </div>
                <div className="w-100 d-flex flex-row justify-content-start">
                    <p className="my-0 w-100 text-left">{text}</p>
                </div>
            </div> 
        )
    }

    const ProgressItem = (props: {
        text: string
    }) => {
        const text = props.text;
        return (
            <div className="ms-5 border-start border-info border-4 p-3 d-flex flex-row gap-5">
                <div className="rounded-circle bg-info my-auto" style={{width: "14px", height: "14px", marginLeft: "-24.5161px"}}></div>
                <p className="my-0">{text}</p>
            </div>
        )
    }

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
                                        <DetailItem icon={faUser} text={`${schedule.user.name} <${schedule.user.email}>`} />
                                        <DetailItem icon={faCalendar} text={schedule.datetime == null ? "等待審核後配置" : dayjs(schedule.datetime).format("YYYY/MM/DD")} />
                                        <DetailItem icon={faLink} text={schedule.link} />
                                        {
                                            schedule.attachments.map((attachment) => {
                                                return <DetailItem icon={faFloppyDisk} text={attachment.realName} />
                                            })
                                        }
                                    </Card>
                                </div>
                            </div>
                            <div className="w-50 d-flex flex-column gap-3">
                                { reviewMode ?
                                    <div>
                                        <h5 className="text-center mb-3">審核</h5>
                                        <Card className="p-5 d-flex flex-column gap-3">
                                            <Button variant="success">同意該活動請求</Button>
                                            <Button variant="danger">拒絕該活動請求</Button>

                                        </Card>
                                    </div> :
                                    <div>
                                        <h5 className="text-center mb-3">日誌</h5>
                                        <Card className="p-5">
                                            <ProgressItem text={"活動已建立"}></ProgressItem>
                                            <ProgressItem text={"活動已審核通過"}></ProgressItem>
                                            <ProgressItem text={"完成發信提醒"}></ProgressItem>
                                            <ProgressItem text={"活動已開始"}></ProgressItem>
                                            <ProgressItem text={"活動已結束"}></ProgressItem>
                                        </Card>
                                    </div>
                                }
                            </div>
                        </div>
                    </>
                }
            </div>
        </Container>
    )
}

export default Schedule;