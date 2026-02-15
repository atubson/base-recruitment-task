import { TicketStatusEnum } from '@/enum/TicketStatusEnum';

const STATUS_LABELS: Record<TicketStatusEnum, string> = {
    [TicketStatusEnum.NEW]: 'Nowe',
    [TicketStatusEnum.IN_PROGRESS]: 'W trakcie',
    [TicketStatusEnum.CLOSED]: 'Zamknięte',
};

export function useTicketStatus() {
    const getReadableStatus = (status: TicketStatusEnum): string => {
        return STATUS_LABELS[status] ?? status;
    };

    return { getReadableStatus };
}
