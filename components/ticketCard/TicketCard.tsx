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
    createdAt: string;
    closedAt: string | null;
    userId: number;
    assignedToId: number | null;
}

// RCC
function TicketCard({ ticket }: { ticket: Ticket }) {
    return (
        <div>
            <Link href={{pathname:`/dashboard/tickets/${ticket.id}`, query: {
                subject: ticket.subject, 
                description: ticket.description,
                status: ticket.status,
                createdAt: ticket.createdAt} }}>
                <h3>
                    {ticket.id}. {ticket.subject}
                </h3>
            </Link>
           

        </div>
    )
}
export default TicketCard;