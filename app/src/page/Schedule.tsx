import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hook";
import { getSchedule } from "../store/dataApi/ScheduleApiSlice";
import { ScheduleType } from "../type/schedule/ScheduleType";
import { Button, Card, List, Tabs, TabsProps, Timeline } from "antd";
import { CalendarOutlined, FolderOutlined, ImportOutlined, LinkOutlined } from "@ant-design/icons";
import UserImage from "./components/UserImage";
import { getWeekdayLabelByValue } from "../items/WeekdayItems";
import { getScheduleRuleLabelByValue } from "../items/ScheduleItems";
import { getPeriodLabelByValue } from "../items/PeriodItems";

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

    const listItems = [
        {
            title: "活動日程",
            icon: <CalendarOutlined style={{fontSize: "3rem"}}></CalendarOutlined>,
            description: schedule?.datetime
        },
        {
            title: "活動規則",
            icon: <ImportOutlined  style={{fontSize: "3rem"}}></ImportOutlined>,
            description: schedule?.hostRule?.name
        },
        {
            title: "活動連結",
            icon: <LinkOutlined  style={{fontSize: "3rem"}}></LinkOutlined>,
            description: <Button className="p-0" type="link">{schedule?.link}</Button>
        },
        {
            title: "活動附件",
            icon: <FolderOutlined  style={{fontSize: "3rem"}}></FolderOutlined>,
            description: schedule?.attachments.map((attachment) => attachment.realName)
        }
    ]

    const progressItems = [
        {
            label: "2024-04-25",
            children: "活動已建立"
        },
        {
            color: "green",
            label: "2024-04-25",
            children: [
                <p className="my-0">活動已通過審核</p>,
                <p className="my-0">於「2024-06-25」進行報告</p>,
                <p className="my-0">在「實驗室例行會議」規則</p>
            ]
        },
        {
            color: "red",
            label: "2024-04-25",
            children: [
                <p className="my-0">活動修改權限已鎖定</p>,
                <p className="my-0">若需修改活動，請聯繫管理員</p>
            ]
        },
        {
            label: "2024-04-29",
            children: [
                <p className="my-0">活動已進行發信</p>,
                <p className="my-0">發信給規則定義的與會者共 16 位</p>,
            ]
        },
        {
            label: "2024-06-24",
            children: [
                <p>已提醒主辦者明天將有活動</p>,
            ]
        },
        {
            color: "green",
            label: "2024-06-25",
            children: [
                <p>活動已舉行</p>,
            ]
        }
    ]

    const tabItems: TabsProps['items'] = [
        {
            key: "1",
            label: "活動資訊",
            children: <div className="d-flex flex-row justify-content-center gap-4"> 
                { schedule && 
                <>
                    <Card title={"活動資訊"} className="w-100">
                        <List
                            itemLayout="horizontal"
                            dataSource={listItems}
                            renderItem={(item) => {
                                return (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={item.icon}
                                            title={item.title}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )
                            }}
                        />
                    </Card>
                    <Card title={"活動日誌"} className="w-100">
                        <Timeline mode="left" items={progressItems}></Timeline>
                    </Card>
                </>
                }
            </div>
        },
        {
            key: "3",
            label: "活動規則與主持人",
            children: <div className="d-flex flex-row justify-content-center gap-4">
                { schedule && 
                    <>
                        <Card title={"主持人"} className="w-100">
                            <div className="w-100 d-flex flex-row gap-5">
                                <UserImage width="10vw" account={schedule?.user.account}></UserImage>
                                <div className="my-auto">
                                    <p className="font-bold">黃漢軒</p>
                                    <p className="my-1">大學部、顧問</p>
                                    <p className="my-1">t109590031@ntut.org.tw</p>
                                </div>
                            </div>
                        </Card>
                        { schedule.hostRule && 
                            <Card title={"活動規則"} className="w-100">
                                <div className="w-100 d-flex flex-row gap-5" style={{height: "10vw"}}>
                                    <div className="my-auto">
                                        <UserImage width="10vw" account={""}></UserImage>
                                    </div>
                                    <div className="my-auto">
                                        <p className="font-bold">{schedule.hostRule.name}</p>
                                        <p className="font-bold my-0">{
                                            getPeriodLabelByValue(schedule.hostRule.period.toString())}，
                                            每{getWeekdayLabelByValue(schedule.hostRule.weekday.toString())}舉行一次
                                        </p>
                                        <p className="font-bold my-0">{getScheduleRuleLabelByValue(schedule.hostRule.rule)}</p>
                                        <p className="font-bold my-0">共有 0 位成員參與這個規則</p>
                                    </div>
                                </div>
                            </Card>
                        }
                    </>
                }
            </div>
        }
    ]

    return (
        <Container className="p-5">
            <h2 className="text-center mb-5">活動資訊</h2>
            <Card className="p-4 mb-3">
                <h2 className="my-0">{schedule?.name}</h2>
            </Card>
            <Tabs items={tabItems}></Tabs>
        </Container>
    )
}

export default Schedule;