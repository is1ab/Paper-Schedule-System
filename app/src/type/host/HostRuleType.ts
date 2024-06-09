export interface HostRulePayloadType {
    name: string,
    weekday: number,
    period: number,
    startDate: string,
    endDate: string,
    rule: string,
    orders: []
}

export interface HostRulePayloadWithIdType extends HostRulePayloadType {
    id: string
}

export interface HostRuleOrdersPayloadType {
    account: string,
    index: number
}

export interface HostRuleDataType {
    id: number,
    name: string,
    startDate: string,
    endDate: string,
    period: number,
    weekday: number,
    rule: string,
    deleted: boolean
}