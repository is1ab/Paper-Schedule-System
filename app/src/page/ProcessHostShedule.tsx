import { Alert, Button, DatePicker, Descriptions, Input, Result, Select, SelectProps, StepProps, Steps, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../store/hook";
import { getUsers } from "../store/dataApi/UserApiSlice";
import { UserType } from "../type/user/userType";
import dayjs, { Dayjs } from "dayjs";
import { NoUndefinedRangeValueType } from "rc-picker/lib/PickerInput/RangePicker"
import { DefaultOptionType, LabeledValue } from "antd/es/select";
import { useNavigate } from "react-router-dom";
import DragableTable from "../components/DragableTable";
import DeletableTable from "../components/DeletableTable";
import { addHostRule } from "../store/dataApi/HostRuleApiSlice";
import { HostRulePayloadType } from "../type/host/HostRuleType";
import { periodItems, getPeriodLabelByValue } from "../items/PeriodItems";
import { scheduleRuleItems } from "../items/ScheduleItems";
import { getWeekdayLabelByValue, weekdayItems } from "../items/WeekdayItems";
import UserAvatarButton from "../components/UserAvatarButton";

const { RangePicker } = DatePicker;

interface UserTypeWithKey extends UserType {
    key: string
}

export default function ProcessHostSchedule(){
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [steps, setSteps] = useState<number>(0)
    const [users, setUsers] = useState<UserType[]>([])
    const [selectedUser, setSelectedUser] = useState<string | undefined>()
    const [scheduleRange, setScheduleRange] = useState<[Dayjs, Dayjs]>([dayjs(Date.now()), dayjs(Date.now()).add(6, "month")]);
    const [scheduleRuleName, setScheduleRuleName] = useState<string>("")
    const [scheduleRuleWeekday, setScheduleRuleWeekday] = useState<string>("1")
    const [scheduleRulePeriod, setScheduleRulePeriod] = useState<string>("1")
    const [scheduleRule, setScheduleRule] = useState<"ALL" | "SCHEDULE">("ALL")
    const [showError, setShowError] = useState<boolean>(false)
    const [isEmptyRuleNameError, setIsEmptyRuleNameError] = useState<boolean>(false)
    const [isEmptyMemberError, setIsEmptyMemberError] = useState<boolean>(false)
    const [userTableDatas, setUserTableDatas] = useState<UserTypeWithKey[]>([])
    const showEmptyRuleNameError = () =>  showError && isEmptyRuleNameError
    const showEmptyMemberError = () => showError && isEmptyMemberError
    const stepItems: StepProps[] = [
        {
            title: '新增規則使用者',
        },
        {
            title: '設定使用者順序',
        },
        {
            title: '設定排程相關參數',
        },
        {
            title: '確認規則',
        },
        {
            title: '完成',
        }
    ]
    
    const [options, setOptions] = useState<SelectProps["options"]>([
        {
            label: "109590031 黃漢軒 [大學部、顧問]",
            value: "109590031"
        }
    ])
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
                    <UserAvatarButton user={record}/>
                )
            }
        },
        {
            title: "身份組",
            dataIndex: "role",
            className: "text-center",
            key: "role",
            width: "16%",
            render: (_text: string, record: any, _index: number) => {
                return <span>{record.role.name}</span>
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
            render: (_text: string, record: any, _index: number) => {
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
    ]

    const addUser = (account: string | undefined) => {
        if(account == undefined){
            return
        }
        if(userTableDatas.find((userTableData => userTableData.account === account))){
            return
        }
        const user = users.find((user) => user.account === account)
        if(user == undefined){
            throw Error("User should not undefined.")
        }
        const tempUserTableDatas = Object.assign([], userTableDatas)
        tempUserTableDatas.push({
            key: user.account,
            ...user
        })
        setUserTableDatas(tempUserTableDatas)
    }

    const submit = () => {
        dispatch(addHostRule({
            name: scheduleRuleName,
            weekday: Number.parseInt(scheduleRuleWeekday),
            period: Number.parseInt(scheduleRulePeriod),
            startDate: scheduleRange[0].format("YYYY-MM-DD"),
            endDate: scheduleRange[1].format("YYYY-MM-DD"),
            rule: scheduleRule,
            orders: userTableDatas.map((user, index) => (
                {
                    account: user.account,
                    index: index,
                }
            ))
        } as HostRulePayloadType)).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                setSteps(steps + 1)
            }
        })
    }

    useEffect(() => {
        dispatch(getUsers()).then((response) => {
            if(response.meta.requestStatus == 'fulfilled'){
                const payload = response.payload;
                const datas = payload.data as UserType[]
                const options = datas.map((data) => {
                    return {
                        label: `${data.account} ${data.name} [${data.note}]`,
                        value: data.account
                    }
                })
                setUsers(datas.map((data) =>{
                    return { 
                        key: data.account,
                        ...data
                    }
                }))
                setOptions(options)
            }
        })
    }, [])

    useEffect(() => {
        setShowError(false)
    }, [scheduleRuleName, userTableDatas])

    useEffect(() => {
        if(options != null){
            setSelectedUser(options[0].value as string);
        }
    }, [options])

    return (
        <Container className="p-5">
            <h2 className="text-center mb-5">新增主持人排定規則</h2>
            <Steps className="border p-4 rounded mb-3" items={stepItems} current={steps}></Steps>
            { steps == 0 &&
                <div className="border rounded p-5 d-flex flex-column gap-3">
                    <div className="d-flex flex-row gap-3">
                        { options != null && 
                            <Select 
                                options={options} 
                                className="w-75" 
                                onSelect={(value: string | number | LabeledValue, _option: DefaultOptionType) => {
                                    setSelectedUser(value as string)
                                }} 
                                value={selectedUser}
                            ></Select>
                        }
                        <Button type="primary" className="w-25" onClick={() => addUser(selectedUser)}>加入主持人</Button>
                    </div>
                    <hr/>
                    <div className="d-flex flex-column gap-3">
                        { showEmptyMemberError() ?  
                            <Alert
                                type="error"
                                message={"錯誤"}
                                description={"請選定至少一個成員"}
                            ></Alert> : null
                        }
                        <DeletableTable columns={columns} dataDispatch={[userTableDatas, setUserTableDatas]}></DeletableTable>
                    </div>
                    <Button type="primary" onClick={() => {
                        if(userTableDatas.length == 0){
                            setIsEmptyMemberError(true)
                            setShowError(true)
                            return
                        }
                        setSteps(steps + 1)
                        setShowError(false)
                    }}> 下一步 </Button>
                </div>
            }
            { steps == 1 &&
                <div className="border rounded p-5 d-flex flex-column gap-3">
                    <div>
                        <DragableTable columns={columns} dataDispatch={[userTableDatas, setUserTableDatas]}></DragableTable>
                    </div>
                    <Button type="primary" onClick={() => setSteps(steps + 1)}> 下一步 </Button>
                </div>
            }
            { steps == 2 &&
                <div className="border rounded p-5 d-flex flex-column gap-5">
                    <div>
                        <h6>排程名稱</h6>
                        <Tooltip placement="top" title={"請輸入排程名稱"} defaultOpen={showEmptyRuleNameError()} open={showEmptyRuleNameError()}>
                            <Input 
                                className="w-100" 
                                defaultValue={scheduleRuleName} 
                                onChange={(e) => setScheduleRuleName(e.target.value)}
                                status={showEmptyRuleNameError() ? "error" : ""}
                            ></Input>
                        </Tooltip>
                    </div>
                    <div>
                        <h6>排程範圍</h6>
                        <RangePicker 
                            className="w-100" 
                            value={scheduleRange}
                            onChange={(dates: NoUndefinedRangeValueType<dayjs.Dayjs> | null, _dateString: [string, string]) => {
                                if(dates == null){
                                    return
                                }
                                const startDate = dates[0];
                                const endDate = dates[1];
                                if(startDate !== null && endDate !== null){
                                    setScheduleRange([startDate, endDate])
                                }
                            }}
                        />
                    </div>
                    <div>
                        <h6>排程星期</h6>
                        <Select 
                            className="w-100" 
                            options={weekdayItems} 
                            defaultValue={scheduleRuleWeekday} 
                            value={scheduleRuleWeekday} 
                            onChange={(value: string, _option: any) => setScheduleRuleWeekday(value)}
                        ></Select>
                    </div>
                    <div>
                        <h6>排程週期</h6>
                        <Select 
                            className="w-100" 
                            options={periodItems} 
                            defaultValue={scheduleRulePeriod} 
                            value={scheduleRulePeriod} 
                            onChange={(value: string, _option: any) => setScheduleRulePeriod(value)}
                        ></Select>
                    </div>
                    <div>
                        <h6>排程規則</h6>
                        <Select 
                            className="w-100" 
                            options={scheduleRuleItems} 
                            defaultValue={"ALL"} 
                            value={scheduleRule} 
                            onChange={(value: ("ALL" | "SCHEDULE"), _option: any) => setScheduleRule(value)}
                        ></Select>
                    </div>
                    <Button type="primary" onClick={() => {
                        if(scheduleRuleName.length === 0){
                            setShowError(true);
                            setIsEmptyRuleNameError(true);
                            return
                        }
                        setSteps(steps + 1)
                    }}> 下一步 </Button>
                </div>
            }
            { steps == 3 &&
                <div className="border rounded p-5 d-flex flex-column gap-5">
                    <Descriptions bordered>
                        <Descriptions.Item label={"排程規則"} span={2}>{scheduleRuleName}</Descriptions.Item>
                        <Descriptions.Item label={"排程星期"} span={1}>{getWeekdayLabelByValue(scheduleRuleWeekday)}</Descriptions.Item>
                        <Descriptions.Item label={"排程週期"} span={2}>{getPeriodLabelByValue(scheduleRulePeriod)}</Descriptions.Item>
                        <Descriptions.Item label={"排程日期"} span={1}>{`${scheduleRange[0].format("YYYY-MM-DD")} ~ ${scheduleRange[1].format("YYYY-MM-DD")}`}</Descriptions.Item>
                        <Descriptions.Item label={"排程順序"} span={3}>
                            <ol className="my-0">
                                {userTableDatas.map((userTableData => {
                                    return <li>{userTableData.name}</li>
                                }))}
                            </ol>
                        </Descriptions.Item>
                    </Descriptions>
                    <Button type="primary" onClick={() => submit()}> 下一步 </Button>
                </div>
            }
            { steps == 4 &&
                <div className="border rounded p-5 d-flex flex-column gap-5">
                    <Result
                        status={"success"}
                        title="新增規則成功"
                        subTitle={`主持人已規劃至活動頁面上，由 ${scheduleRange[0].format("YYYY-MM-DD")} 開始，在 ${scheduleRange[1].format("YYYY-MM-DD")} 結束`}
                        extra={[
                            <Button type="primary" className="w-100" onClick={() => navigate("/")}>回到首頁</Button>
                        ]}
                    />
                </div>
            }
        </Container>
    )
}