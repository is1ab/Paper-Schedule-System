import { StepProps, Steps } from "antd";
import { useState } from "react";
import { Container } from "react-bootstrap";

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
    return (
        <Container className="p-5">
            <h2 className="text-center mb-5">新增主持人排定規則</h2>
            <Steps className="border p-4 rounded mb-3" items={stepItems} current={steps}></Steps>
            <div className="border rounded p-5">

            </div>
        </Container>
    )
}