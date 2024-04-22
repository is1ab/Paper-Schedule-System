import { Button, Descriptions, Input, Select, SelectProps, StepProps, Steps, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import UserAvatar from "./components/UserAvatar";
import { CheckCircleFilled, CheckCircleOutlined, MenuOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useAppDispatch } from "../store/hook";
import { getUsers } from "../store/dataApi/UserApiSlice";
import { UserType } from "../type/user/userType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSquareCheck } from "@fortawesome/free-solid-svg-icons";

export default function ProcessHostSchedule(){
    const dispatch = useAppDispatch()
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
    const [steps, setSteps] = useState<number>(0)
    const [users, setUsers] = useState<UserType[]>([])
    const [selectedUser, setSelectedUser] = useState<string>()
    const [scheduleRuleName, setScheduleRuleName] = useState<string>("")
    const [scheduleRuleWeekday, setScheduleRuleWeekday] = useState<string>("1")
    const [scheduleRulePeriod, setScheduleRulePeriod] = useState<string>("1")
    const [scheduleRule, setScheduleRule] = useState<"ALL" | "SCHEDULE">("ALL")
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
            key: 'sort',
        },
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
    const [userTableDatas, setUserTableDatas] = useState<{
        key: string,
        account: string,
        name: string,
        role: {
            id: number,
            name: string
        },
        note: string,
        blocked: boolean
    }[]>([])

    interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
        'data-row-key': string;
    }
      
    const Row = ({ children, ...props }: RowProps) => {
        const {
          attributes,
          listeners,
          setNodeRef,
          setActivatorNodeRef,
          transform,
          transition,
          isDragging,
        } = useSortable({
          id: props['data-row-key'],
        });
      
        const style: React.CSSProperties = {
          ...props.style,
          transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
          transition,
          ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
        };
      
        return (
          <tr {...props} ref={setNodeRef} style={style} {...attributes}>
            {React.Children.map(children, (child) => {
              if ((child as React.ReactElement).key === 'sort') {
                return React.cloneElement(child as React.ReactElement, {
                  children: (
                    <MenuOutlined
                      ref={setActivatorNodeRef}
                      style={{ touchAction: 'none', cursor: 'move' }}
                      {...listeners}
                    />
                  ),
                });
              }
              return child;
            })}
          </tr>
        );
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
          setUserTableDatas((previous) => {
            const activeIndex = previous.findIndex((i) => i.key === active.id);
            const overIndex = previous.findIndex((i) => i.key === over?.id);
            return arrayMove(previous, activeIndex, overIndex);
          });
        }
    };

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
            account: user.account,
            name: user.name,
            role: user.role,
            note: user.note,
            blocked: user.blocked
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
                setUsers(datas)
                setOptions(options)
            }
        })
    }, [])

    return (
        <Container className="p-5">
            <h2 className="text-center mb-5">新增主持人排定規則</h2>
            <Steps className="border p-4 rounded mb-3" items={stepItems} current={steps}></Steps>
            { steps == 0 &&
                <div className="border rounded p-5 d-flex flex-column gap-3">
                    <div className="d-flex flex-row gap-3">
                        <Select options={options} className="w-75" onSelect={(value, _option) => setSelectedUser(value)}></Select>
                        <Button type="primary" className="w-25" onClick={() => addUser(selectedUser)}>加入主持人</Button>
                    </div>
                    <hr/>
                    <div>
                        <Table columns={columns} dataSource={userTableDatas}></Table>
                    </div>
                    <Button type="primary" onClick={() => setSteps(steps + 1)}> 下一步 </Button>
                </div>
            }
            { steps == 1 &&
                <div className="border rounded p-5 d-flex flex-column gap-3">
                    <div>
                        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                            <SortableContext items={userTableDatas.map(i => i.key)}>
                                <Table 
                                    components={{
                                        body: {
                                            row: Row
                                        }
                                    }} 
                                    rowKey="key"
                                    columns={columns} 
                                    dataSource={userTableDatas}
                                    pagination={false}
                                />
                            </SortableContext>
                        </DndContext>
                    </div>
                    <Button type="primary" onClick={() => setSteps(steps + 1)}> 下一步 </Button>
                </div>
            }
            { steps == 2 &&
                <div className="border rounded p-5 d-flex flex-column gap-5">
                    <div>
                        <h6> 排程名稱 </h6>
                        <Input className="w-100" defaultValue={scheduleRuleName} onChange={(e) => setScheduleRuleName(e.target.value)}></Input>
                    </div>
                    <div>
                        <h6> 排程星期 </h6>
                        <Select 
                            className="w-100" 
                            options={weekdayItems} 
                            defaultValue={scheduleRuleWeekday} 
                            value={scheduleRuleWeekday} 
                            onChange={(value: string, _option: any) => setScheduleRuleWeekday(value)}
                        ></Select>
                    </div>
                    <div>
                        <h6> 排程週期 </h6>
                        <Select 
                            className="w-100" 
                            options={periodItems} 
                            defaultValue={scheduleRulePeriod} 
                            value={scheduleRulePeriod} 
                            onChange={(value: string, _option: any) => setScheduleRulePeriod(value)}
                        ></Select>
                    </div>
                    <div>
                        <h6> 排程規則 </h6>
                        <Select 
                            className="w-100" 
                            options={scheduleRuleItems} 
                            defaultValue={"ALL"} 
                            value={scheduleRule} 
                            onChange={(value: ("ALL" | "SCHEDULE"), _option: any) => setScheduleRule(value)}
                        ></Select>
                    </div>
                    <Button type="primary" onClick={() => setSteps(steps + 1)}> 下一步 </Button>
                </div>
            }
            { steps == 3 &&
                <div className="border rounded p-5 d-flex flex-column gap-5">
                    <Descriptions bordered>
                        <Descriptions.Item label={"排程規則"}>{scheduleRuleName}</Descriptions.Item>
                        <Descriptions.Item label={"排程星期"}>{weekdayItems.find((weekdayItem => weekdayItem.value === scheduleRuleWeekday))?.label}</Descriptions.Item>
                        <Descriptions.Item label={"排程週期"}>{periodItems.find((periodItem => periodItem.value === scheduleRulePeriod))?.label}</Descriptions.Item>
                        <Descriptions.Item label={"排程順序"} span={3}>
                            <ol>
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
                            <p className="my-0">主持人已規劃至活動頁面上，由 04/22 開始</p>
                        </div>
                    </div>
                    <div>
                        <Button type="primary" className="w-100">回到首頁</Button>
                    </div>
                </div>
            }
        </Container>
    )
}