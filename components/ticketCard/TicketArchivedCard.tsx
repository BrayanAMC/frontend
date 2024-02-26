'use client'
import Link from "next/link";
import ticketImage from '@/img/ticket.png'
import Image from "next/image";

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

interface TicketCardProps {
    ticket: Ticket;
    path : string;
    email: string;
}

// RCC
function TicketArchivedCard({ ticket, path, email }: TicketCardProps) {
    return (
        <div className="m-6 flex justify-center">
            <Link href={{
                pathname: `${path}/${ticket.id}`, query: {
                    subject: ticket.subject,
                    description: ticket.description,
                    status: ticket.status,
                    createdAt: ticket.createdAt,
                    userId: ticket.userId,
                    email: email
                }
            }}
                className="max-w-md bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <Image className="h-48 w-full object-cover md:w-48" src={ticketImage} alt="ticket" />
        </div>
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Ticket #{ticket.id}</div>
                        <p className="block mt-1 text-lg leading-tight font-medium text-black">{ticket.subject}</p>
                        <p className="mt-2 text-gray-500">{ticket.description}</p>
                        <p className="mt-2 text-gray-500">Status: {ticket.status}</p>
                        <p className="mt-2 text-gray-500">Created At: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
export default TicketArchivedCard;