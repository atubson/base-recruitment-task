import { TicketPriorityEnum } from '@/enum/TicketPriorityEnum';

const PRIORITY_LABELS: Record<TicketPriorityEnum, string> = {
    [TicketPriorityEnum.LOW]: 'Niski',
    [TicketPriorityEnum.MEDIUM]: 'Średni',
    [TicketPriorityEnum.HIGH]: 'Wysoki',
};

export function useTicketPriority() {
    const getReadablePriority = (priority: TicketPriorityEnum): string => {
        return PRIORITY_LABELS[priority] ?? priority;
    };

    return { getReadablePriority };
}
