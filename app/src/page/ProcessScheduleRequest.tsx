import { LinkOutlined } from "@ant-design/icons";
import { Button, Calendar, Descriptions, DescriptionsProps, StepProps, Steps } from "antd";
import { useState } from "react";
import { Container } from "react-bootstrap";

export default function ProcessScheduleRequest(){
    const [steps, setSteps] = useState<number>(0)
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
                    <h6> 請挑選日期 </h6>
                    <div className="w-100 d-flex flex-row gap-3">
                        <Calendar 
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