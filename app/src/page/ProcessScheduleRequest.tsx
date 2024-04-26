import { CheckCircleOutlined, ClockCircleOutlined, LinkOutlined } from "@ant-design/icons";
import { Badge, Button, Calendar, Descriptions, DescriptionsProps, StepProps, Steps, Tag, Tooltip } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ScheduleType } from "../type/schedule/ScheduleType";
import UserAvatar from "./components/UserAvatar";
import { useNavigate } from "react-router-dom";
import HolidayTooltip from "../components/HolidayTooltip";
import { getAllSchedule } from "../store/dataApi/ScheduleApiSlice";
import EventTooltip from "../components/EventTooltip";
import { useAppDispatch } from "../store/hook";
export default function ProcessScheduleRequest(){
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [steps, setSteps] = useState<number>(0)
    const [schedules, setSchedules] = useState<ScheduleType[]>([])
    const [cursorSelect, setCursorSelect] = useState<{
        hostRuleId: number,
        account: string,
        hostRuleIter: number
    } | null>(null)
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(Date.now()))
    const stepItems: StepProps[] = [
        {
            title: '確認相關資料',
        },
        {
            title: '排定時間',
        },
        {
            title: '確認審核結果',
        },
        {
            title: '完成',
        }
    ]
    const descriptionItems: DescriptionsProps['items'] = [
        {
            key: "1",
            label: "名稱",
            children: "EPREKM: ElGamal proxy re-encryption-based key management scheme with constant rekeying cost and linear public bulletin size",
            span: 3
        },
        {
            key: "2",
            label: "主持人",
            children: "黃漢軒",
        },
        {
            key: "3",
            label: "創立時間",
            children: "2024/04/19",
        },
        {
            key: "4",
            label: "報告時間",
            children: "2024/04/19",
        },
        {
            key: "5",
            label: "論文連結",
            children: (
                <div className="d-flex flex-column gap-3">
                    <Button type="link">https://doi.org/10.2172/6223037</Button>
                </div>
            ),
            span: 1
        },
        {
            key: "6",
            label: "附件",
            children: (
                <div className="d-flex flex-column gap-3">
                    <Button type="link" icon={<LinkOutlined />}>附件 1</Button>
                    <Button type="link" icon={<LinkOutlined />}>附件 2</Button>
                    <Button type="link" icon={<LinkOutlined />}>附件 3</Button>
                    <Button type="link" icon={<LinkOutlined />}>附件 4</Button>
                </div>
            ),
            span: 1
        }
    ]

    const EventTooltip = (props: {
        schedule: ScheduleType
    }) => {
        const schedule = props.schedule;
        return (
            <div className="p-2 d-flex flex-column gap-2">
                { schedule.user &&
                    <div className="d-flex flex-row gap-1">
                        <UserAvatar account={schedule.user.account} size="xs"></UserAvatar>
                        <span className="my-auto">{schedule.user.name}</span>
                    </div>
                }
                <div className="d-flex flex-column gap-1">
                    <Tag color="default">{schedule.hostRule?.name}</Tag>
                    <Tag icon={<CheckCircleOutlined />} color="green">{schedule.status.name}</Tag>
                </div>
                <div className="d-flex flex-row gap-3">
                    <span>{schedule.name}</span>
                </div>
                <div className="w-100">
                    <span style={{color: "#bbbbbb"}}>不可覆蓋，該行程已被安排</span>
                </div>
            </div>
        )
    }

    const PendingTooltip = (props: {
        schedule: ScheduleType
    }) => {
        const schedule = props.schedule;
        
        return (
            <div className="p-2 d-flex flex-column gap-2">
                <div className="d-flex flex-row gap-1">
                    <UserAvatar account={schedule.user.account} size="xs"></UserAvatar>
                    <span className="my-auto">{schedule.user.name}</span>
                </div>
                <div className="d-flex flex-column gap-1">
                    <Tag color="default">{schedule.hostRule?.name}</Tag>
                    <Tag icon={<ClockCircleOutlined />} color="default">等待規劃中</Tag>
                </div>
                <div className="w-100">
                    <span style={{color: "#bbbbbb"}}>點擊行程來進行覆蓋</span>
                </div>
            </div>
        )
    }

    const cellRender = (date: Dayjs, _info: any) => {
        return (
            <ul className="events">
                {
                    schedules.filter((schedule) => schedule.datetime == date.format("YYYY-MM-DD") && dayjs(schedule.datetime, "YYYY-MM-DD").isSame(selectedDate, 'month')).map((schedule) => {
                        if(schedule.status.id == 5){
                            return (
                                <Tooltip placement="right" title={<HolidayTooltip holiday={schedule} />}>
                                    <li key={schedule.name}>
                                        <Badge status="error" style={{color: "#bbbbbb"}} text={`活動暫停：${schedule.name}`}></Badge>
                                    </li>
                                </Tooltip>
                            )
                        }
                        if(schedule.status.id == 4){
                            return (
                                <Tooltip placement="right" title={<PendingTooltip schedule={schedule}/>}>
                                    <li key={schedule.name} onClick={() => {
                                         setCursorSelect({
                                            hostRuleId: schedule.hostRule!.id,
                                            account: schedule.user.account,
                                            hostRuleIter: schedule.hostRuleIter
                                        })
                                    }}>
                                        { (schedule.hostRule && cursorSelect && schedule.hostRule.id == cursorSelect.hostRuleId && schedule.hostRuleIter == cursorSelect.hostRuleIter && schedule.user.account == cursorSelect.account) ?
                                            <Badge status="processing" className="p-1 bg-opacity-25 rounded" style={{backgroundColor: "#00ff8844"}} text={`${schedule.user.name} - ${schedule.hostRule?.name}`}></Badge> :
                                            <Badge status="processing" text={`${schedule.user.name} - ${schedule.hostRule?.name}`}></Badge>
                                        }
                                    </li>
                                </Tooltip>
                            )
                        }
                        return (
                            <Tooltip placement="right" title={<EventTooltip schedule={schedule}/>}>
                                <li key={schedule.name}>
                                    { schedule.user ? 
                                        <Badge status="success" style={{color: "#bbbbbb"}} text={schedule.user.name + " - " + schedule.name}></Badge> :
                                        <Badge status="success" style={{color: "#bbbbbb"}} text={schedule.name}></Badge>
                                    }
                                </li>
                            </Tooltip>
                        )
                    })
                }
            </ul>
        )
    }

    useEffect(() => {
        dispatch(getAllSchedule()).then((response: any) => {
            if(response.meta.requestStatus == 'fulfilled'){
                const payload = response.payload;
                const datas= payload["data"] as ScheduleType[];
                setSchedules(datas.filter((data => data.status.id === 2 || data.status.id === 4 || data.status.id === 5)))
            }
        })
    }, [])


    return (
        <Container className="p-5">
            <h2 className="text-center mb-5">審核活動</h2>
            <Steps className="border p-4 rounded mb-3" items={stepItems} current={steps}></Steps>
            { steps == 0 &&
                <div className="p-5 border rounded d-flex flex-column gap-3">
                    <Descriptions className="w-100" bordered title={"活動相關資訊"} items={descriptionItems}></Descriptions>
                    <hr></hr>
                    <Button type="primary" onClick={() => setSteps(steps + 1)}>完成確認</Button>
                </div>
            }
            { steps == 1 &&
                <div className="p-5 border rounded d-flex flex-column gap-3">
                    <h6> 請覆蓋某個已被規則所排定的活動 </h6>
                    <div className="w-100 d-flex flex-row gap-3">
                            <Calendar 
                                cellRender={cellRender}
                                className="w-100 p-3 border rounded process-schedule-calendar"
                                value={selectedDate}
                                onSelect={(date, _selectInfo) => setSelectedDate(date)}
                                disabledDate={(date) => !date.isSame(selectedDate, 'month')}
                            ></Calendar>
                    </div>
                    <hr></hr>
                    <Button type="primary" disabled={cursorSelect == null} onClick={() => setSteps(steps + 1)}>完成確認</Button>
                </div>
            }
            { steps == 2 &&
                <div className="p-5 border rounded d-flex flex-column gap-3">
                    <Descriptions className="w-100" bordered title={"活動相關資訊"} items={descriptionItems}></Descriptions>
                    <hr></hr>
                    <Button type="primary" onClick={() => setSteps(steps + 1)}>完成確認</Button>
                </div>
            }
        </Container>
    )
}