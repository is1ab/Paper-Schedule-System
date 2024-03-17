export interface AddSchedulePayloadType {
    name: string,
    link: string,
    description: string,
    attachments: AddScheduleAttachmentPayloadType[]
}

export interface AddScheduleAttachmentPayloadType {
    fileKey: string,
    realName: string
}