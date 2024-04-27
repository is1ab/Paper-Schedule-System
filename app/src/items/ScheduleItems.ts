import { SelectProps } from "antd";

export const scheduleRuleItems: SelectProps["options"] = [
    {
        label: "對於每個禮拜，所有主持人共同主持會議",
        value: "ALL"
    },
    {
        label: "主持人輪替主持會議",
        value: "SCHEDULE"
    }
]

export function getScheduleRuleLabelByValue(value: string): string | undefined{
    return scheduleRuleItems?.find((scheduleRuleItem) => scheduleRuleItem.value === value)?.label as string | undefined;
}