import { Alert, Button, DatePicker, Descriptions, Input, Select, SelectProps, StepProps, Steps, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import UserAvatar from "./components/UserAvatar";
import { CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../store/hook";
import { getUsers } from "../store/dataApi/UserApiSlice";
import { UserType } from "../type/user/userType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import dayjs, { Dayjs } from "dayjs";
import { NoUndefinedRangeValueType } from "rc-picker/lib/PickerInput/RangePicker"
import { DefaultOptionType, LabeledValue } from "antd/es/select";
import { useNavigate } from "react-router-dom";
import DragableTable from "../components/DragableTable";
import DeletableTable from "../components/DeletableTable";

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
    const weekdayItems: SelectProps["options"] = [
        {
            label: "週一",
            value: "1"
        },
        {
            label: "週二",
            value: "2"
        },
        {
            label: "週三",
            value: "3"
        },
        {
            label: "週四",
            value: "4"
        },
        {
            label: "週五",
            value: "5"
        },
        {
            label: "週六",
            value: "6"
        },
        {
            label: "週日",
            value: "7"
        }
    ]
    const periodItems: SelectProps["options"] = [
        {
            label: "一個禮拜一次",
            value: "1"
        },
        {
            label: "兩個禮拜一次",
            value: "2"
        },
        {
            label: "三個禮拜一次",
            value: "3"
        },
        {
            label: "四個禮拜一次",
            value: "4"
        }
    ]
    const scheduleRuleItems: SelectProps["options"] = [
        {
            label: "對於每個禮拜，所有主持人共同主持會議",
            value: "ALL"
        },
        {
            label: "主持人輪替主持會議",
            value: "SCHEDULE"
        }
    ]
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
            render: (text: string, record: any, _index: number) => {
                return (
                    <Button type="default" className="mx-auto d-flex flex-row gap-2 justify-content-center">
                        <UserAvatar account={record.account} size="xs"></UserAvatar>
                        <span className="my-auto"> {text} </span>
                    </Button>
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
                            minDate={dayjs(Date.now())}
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
                        <Descriptions.Item label={"排程星期"} span={1}>{weekdayItems.find((weekdayItem => weekdayItem.value === scheduleRuleWeekday))?.label}</Descriptions.Item>
                        <Descriptions.Item label={"排程週期"} span={2}>{periodItems.find((periodItem => periodItem.value === scheduleRulePeriod))?.label}</Descriptions.Item>
                        <Descriptions.Item label={"排程日期"} span={1}>{`${scheduleRange[0].format("YYYY-MM-DD")} ~ ${scheduleRange[1].format("YYYY-MM-DD")}`}</Descriptions.Item>
                        <Descriptions.Item label={"排程順序"} span={3}>
                            <ol className="my-0">
                                {userTableDatas.map((userTableData => {
                                    return <li>{userTableData.name}</li>
                                }))}
                            </ol>
                        </Descriptions.Item>
                    </Descriptions>
                    <Button type="primary" onClick={() => setSteps(steps + 1)}> 下一步 </Button>
                </div>
            }
            { steps == 4 &&
                <div className="border rounded p-5 d-flex flex-column gap-5">
                    <div className="d-flex flex-row gap-3 mx-auto p-5 ">
                        <FontAwesomeIcon icon={faSquareCheck} style={{fontSize: "5rem", color: "green"}}/>
                        <div className="d-flex flex-column my-auto gap-2">
                            <h4 className="my-0"> 新增規則成功 </h4>
                            <p className="my-0">{`主持人已規劃至活動頁面上，由 ${scheduleRange[0].format("YYYY-MM-DD")} 開始，在 ${scheduleRange[1].format("YYYY-MM-DD")} 結束`}</p>
                        </div>
                    </div>
                    <div>
                        <Button type="primary" className="w-100" onClick={() => navigate("/")}>回到首頁</Button>
                    </div>
                </div>
            }
        </Container>
    )
}