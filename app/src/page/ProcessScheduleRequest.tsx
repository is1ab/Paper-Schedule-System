import { CheckCircleOutlined, ClockCircleOutlined, LinkOutlined } from "@ant-design/icons";
import { Badge, Button, Calendar, Descriptions, DescriptionsProps, StepProps, Steps, Tag, Tooltip } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { ScheduleStatusType, ScheduleType } from "../type/schedule/ScheduleType";
import UserAvatar from "./components/UserAvatar";
import { UserType } from "../type/user/userType";
import { RoleType } from "../type/setting/RoleType";
import { useNavigate } from "react-router-dom";
import type { CellRenderInfo } from "rc-picker/lib/interface"
import { SelectInfo } from "antd/es/calendar/generateCalendar";
export default function ProcessScheduleRequest(){
    const navigate = useNavigate()
    const [steps, setSteps] = useState<number>(0)
    const [cursorSelect, setCursorSelect] = useState<{
        overrideEventId: string
    }>({
        overrideEventId: ""
    })
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
    const schedules = [
        {
            datetime: "2024-04-25",
            description: "",
            id: "0af1db7c-2204-4d53-8640-731d46e90d10",
            link: "...",
            name: "實驗室例行會議",
            status: {
                id: 1,
                name: "PENDING"
            } as ScheduleStatusType,
            user: {
                id: 1,
                account: "109590031",
                name: "黃漢軒",
                role: {
                    id: 1,
                    name: "Student"
                } as RoleType,
                note: "",
                weight: 1,
                blocked: false,
                email: "t109590031@ntut.org.tw",
                schedules: [] as ScheduleType[]
            } as UserType,
            attachments: []
        },
        {
            datetime: "2024-04-26",
            description: "",
            id: "0af1db7c-2204-4d53-8640-731d46e90d10",
            link: "...",
            name: "Probing the Anisotropy and Non-Gaussianity in the Redshift Space through the Conditional Moments of the First Derivative",
            status: {
                id: 3,
                name: "DONE"
            },
            user: {
                id: 1,
                account: "109590031",
                name: "黃漢軒",
                role: {
                    id: 1,
                    name: "Student"
                } as RoleType,
                note: "",
                weight: 1,
                blocked: false,
                email: "t109590031@ntut.org.tw",
                schedules: [] as ScheduleType[]
            } as UserType,
            attachments: []
        },
        {
            datetime: "2024-04-28",
            description: "",
            id: "0af1db7c-2204-4d53-8640-731d46e90d10",
            link: "...",
            name: "Stability of solid-state formamide under Lyα irradiation",
            status: {
                id: 3,
                name: "DONE"
            },
            user: {
                id: 1,
                account: "109590031",
                name: "黃漢軒",
                role: {
                    id: 1,
                    name: "Student"
                } as RoleType,
                note: "",
                weight: 1,
                blocked: false,
                email: "t109590031@ntut.org.tw",
                schedules: [] as ScheduleType[]
            } as UserType,
            attachments: []
        }
    ] as ScheduleType[]
    const EventTooltip = (schedule: ScheduleType) => {
        return (
            <div className="p-2 d-flex flex-column gap-2">
                <div className="d-flex flex-row gap-1">
                    <UserAvatar account={schedule.user.account} size="xs"></UserAvatar>
                    <span className="my-auto">{schedule.user.name}</span>
                </div>
                <div className="d-flex flex-column gap-1">
                    <Tag color="default">實驗室例行會議</Tag>
                    { schedule.status.name == "PENDING" ?
                        <Tag icon={<ClockCircleOutlined />} color="default">等待排定中</Tag> :
                        <Tag icon={<CheckCircleOutlined />} color="green">已完成審核</Tag>
                    }
                    
                </div>
                <div className="d-flex flex-row gap-3">
                    <span>{schedule.name}</span>
                </div>
                <div className="w-100">
                    { schedule.status.name == "PENDING" ?
                        <Button type="primary" className="w-100 px-5" onClick={() => {
                            if(schedule.status.name === "PENDING"){
                                setCursorSelect({
                                    overrideEventId: schedule.id
                                })
                            }
                        }}>覆蓋該活動</Button> :
                        <span style={{color: "#999999"}}>不可選取：活動主題已安排</span>
                    }
                </div>
            </div>
        )
    }
    const cellRender = (date: Dayjs, info: any) => {
        const items = schedules.filter((schedule) => schedule.datetime == date.format("YYYY-MM-DD")).map((schedule) => {
            return (
                <Tooltip placement="right" title={EventTooltip(schedule)}>
                    <li key={schedule.name} style={{zIndex: 100}}>
                        { schedule.status.name == "PENDING" ?
                            <Badge 
                                status="processing" 
                                text={<span 
                                    style={{
                                        background: cursorSelect.overrideEventId === schedule.id ? "#00ff0033" : "",
                                        padding: cursorSelect.overrideEventId === schedule.id ? "0.25rem" : "",
                                    }}>{schedule.user.name + " - " + schedule.name}</span>} 
                                className="rounded"
                            ></Badge> :
                            <Badge status="success" text={schedule.user.name + " - " + schedule.name} style={{color: "#999999", cursor: "Default"}}></Badge>
                        }
                    </li>
                </Tooltip>
            )
        })
        return (
            <ul className="events">
                {items}
            </ul> 
        )
    }

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
                                className="w-100 p-3 border rounded"
                            ></Calendar>
                    </div>
                    <hr></hr>
                    <Button type="primary" onClick={() => setSteps(steps + 1)}>完成確認</Button>
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