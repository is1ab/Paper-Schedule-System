import { SelectProps } from "antd";

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

export default periodItems == null ? [] : periodItems;