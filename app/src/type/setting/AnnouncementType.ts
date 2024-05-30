interface AnnouncementType {
    description: string
    id: string
    type: "ERROR" | "WARNING" | "INFO"
    validEndDate: string
    validStartDate: string
}