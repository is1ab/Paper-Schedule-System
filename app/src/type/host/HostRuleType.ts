export interface HostRulePayloadType {
    name: string,
    weekday: number,
    period: number,
    startDate: string,
    endDate: string,
    rule: string,
    orders: string[]
}