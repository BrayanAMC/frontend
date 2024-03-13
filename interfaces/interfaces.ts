export enum TicketStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    CLOSED = "CLOSED",
}

export interface Ticket {
    id: number;
    subject: string;
    description: string;
    status: TicketStatus;
    createdAt: string;
    closedAt: string | null;
    userId: number;
    assignedToId: number | null;
    institutionId: number;
    archived: boolean;

}


export interface Institution {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;

}