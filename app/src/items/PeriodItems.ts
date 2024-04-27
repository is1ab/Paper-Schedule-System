import { SelectProps } from "antd";

export const periodItems: SelectProps["options"] = [
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

export function getPeriodLabelByValue(value: string): string | undefined{
    return periodItems?.find((periodItem) => periodItem.value === value)?.label as string | undefined;
}