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

export enum RoleStatus {
    ADMIN = "admin",
    SUPER_ADMIN = "superadmin",
    USER = "user",
}


export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accessToken: string;
    recoveryPasswordToken: string;
    role: RoleStatus;
    institutionId?: number;
}

export type TicketProps = {
    id: string | number;
    subject: string;
    description: string;
    status: string;
    createdAt: string;
    userId: number;
    email: string;
};