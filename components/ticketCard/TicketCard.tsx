'use client'
import Link from "next/link";

export enum TicketStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    CLOSED = "CLOSED",
}

interface Ticket {
    id: number;
    subject: string;
    description: string;
    status: TicketStatus;
    createdAt: Date;
    closedAt: Date | null;
    userId: number;
    assignedToId: number | null;
}

// RCC
function TaskCard({ ticket }: { ticket: Ticket }) {
    return (
        <div>
            <Link href={`/app/dashboard/tickets/${ticket.id}`}>
                <h3>
                    {ticket.id}. {ticket.subject}
                </h3>
            </Link>
            <p>{ticket.description}</p>

        </div>
    )
}
export default TaskCard;