import { Button, Container, Tooltip } from "react-bootstrap";
import { Calendar, Steps, Whisper } from "rsuite";
import { ScheduleType } from "../type/schedule/ScheduleType";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import UserAvatar from "./components/UserAvatar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function ManageSchedule(){
    const [current, setCurrent] = useState<number>(0)

    return (
        <Container className="p-5 d-flex flex-column gap-4" style={{width: "90%"}}>
            <h2 className="text-center"> 管理活動 </h2>
            <Steps className="w-100 p-5 d-none d-md-flex border rounded" current={current}>
                <Steps.Item title={"規則設定"} />
                <Steps.Item title={"活動預覽"} />
                <Steps.Item title={"完成"} />
            </Steps>
            <div className="border rounded p-5 d-flex flex-column gap-5">
                <div>
                    <h4>設定固定開會星期</h4>
                    <p><small>用於在某個固定的星期進行報告循環</small></p>
                    <input className="w-100"></input>
                </div>
                <div>
                    <h4>設定忽略週次</h4>
                    <p><small>用於在某個固定的星期進行報告循環</small></p>
                    <input className="w-100"></input>
                </div>
                <div>
                    <h4>設定重報週次</h4>
                    <p><small>用於設定某個使用者需要進行重報</small></p>
                    <input className="w-100"></input>
                </div>
            </div>
        </Container>
    )
}