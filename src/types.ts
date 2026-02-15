import { TicketPriorityEnum } from '@/enum/TicketPriorityEnum';
import { TicketStatusEnum } from '@/enum/TicketStatusEnum';

export interface ITicket {
    id: number
    customerName: string
    subject: string
    description: string
    priority: TicketPriorityEnum
    status: TicketStatusEnum
    createdAt: string // ISO 8601 date string
}
