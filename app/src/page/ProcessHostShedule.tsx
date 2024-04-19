import { Button, Descriptions, Input, Select, SelectProps, StepProps, Steps, Table } from "antd";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import UserAvatar from "./components/UserAvatar";
import { CheckCircleOutlined, MenuOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Option } from "antd/es/mentions";

export default function ProcessHostSchedule(){
    const [steps, setSteps] = useState<number>(0)
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
    const options: SelectProps["options"] = [
        {
            label: "109590031 黃漢軒 [大學部、顧問]",
            value: "109590031"
        }
    ]
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
    }[]>([
        {
            key: "109590031",
            account: "109590031",
            name: "黃漢軒",
            role: {
                id: 1,
                name: "Student"
            },
            note: "大學部、顧問",
            blocked: false
        },
        {
            key: "user1",
            account: "user1",
            name: "user1",
            role: {
                id: 1,
                name: "Student"
            },
            note: "大學部、顧問",
            blocked: false
        }
    ])

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

    return (
        <Container className="p-5">
            <h2 className="text-center mb-5">新增主持人排定規則</h2>
            <Steps className="border p-4 rounded mb-3" items={stepItems} current={steps}></Steps>
            { steps == 0 &&
                <div className="border rounded p-5 d-flex flex-column gap-3">
                    <div className="d-flex flex-row gap-3">
                        <Select options={options} className="w-75"></Select>
                        <Button type="primary" className="w-25">加入主持人</Button>
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
                        <Input className="w-100"></Input>
                    </div>
                    <div>
                        <h6> 排程星期 </h6>
                        <Select className="w-100">
                            <Option value="1">週一</Option>
                            <Option value="2">週二</Option>
                            <Option value="3">週三</Option>
                            <Option value="4">週四</Option>
                            <Option value="5">週五</Option>
                            <Option value="6">週六</Option>
                            <Option value="7">週日</Option>
                        </Select>
                    </div>
                    <div>
                        <h6> 排程週期 </h6>
                        <Select className="w-100">
                            <Option value="1">一個禮拜一次</Option>
                            <Option value="2">兩個禮拜一次</Option>
                            <Option value="3">三個禮拜一次</Option>
                            <Option value="4">四個禮拜一次</Option>
                        </Select>
                    </div>
                    <Button type="primary" onClick={() => setSteps(steps + 1)}> 下一步 </Button>
                </div>
            }
            { steps == 3 &&
                <div className="border rounded p-5 d-flex flex-column gap-5">
                    <Descriptions bordered>
                        <Descriptions.Item label={"排程規則"}>排程名稱</Descriptions.Item>
                        <Descriptions.Item label={"排程星期"}>週四</Descriptions.Item>
                        <Descriptions.Item label={"排程週期"}>兩個禮拜一次</Descriptions.Item>
                        <Descriptions.Item label={"排程順序"} span={3}>
                            <ol>
                                <li>黃漢軒</li>
                                <li>user1</li>
                                <li>user1</li>
                                <li>user1</li>
                                <li>user1</li>
                                <li>user1</li>
                                <li>user1</li>
                                <li>user1</li>
                                <li>user1</li>
                                <li>user1</li>
                                <li>user1</li>
                                <li>user1</li>
                                <li>user1</li>
                            </ol>
                        </Descriptions.Item>
                    </Descriptions>
                    <Button type="primary" onClick={() => setSteps(steps + 1)}> 下一步 </Button>
                </div>
            }
        </Container>
    )
}