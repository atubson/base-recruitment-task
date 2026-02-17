import { describe, it, expect } from 'vitest';
import { useTicketStatus } from '../useTicketStatus';
import { TicketStatusEnum } from '@/enum/TicketStatusEnum';

describe('useTicketStatus', () => {
    it('should return getReadableStatus and getStatusClass functions', () => {
        const { getReadableStatus, getStatusClass } = useTicketStatus();

        expect(typeof getReadableStatus).toBe('function');
        expect(typeof getStatusClass).toBe('function');
    });

    describe('getReadableStatus', () => {
        it('should return correct Polish labels for all status values', () => {
            const { getReadableStatus } = useTicketStatus();

            expect(getReadableStatus(TicketStatusEnum.NEW)).toBe('Nowe');
            expect(getReadableStatus(TicketStatusEnum.IN_PROGRESS)).toBe('W trakcie');
            expect(getReadableStatus(TicketStatusEnum.CLOSED)).toBe('Zamknięte');
        });

        it('should return the raw value when status is unknown', () => {
            const { getReadableStatus } = useTicketStatus();

            const unknownStatus = 'unknown' as TicketStatusEnum;

            expect(getReadableStatus(unknownStatus)).toBe('unknown');
        });
    });

    describe('getStatusClass', () => {
        it('should return the status value as class name for all statuses', () => {
            const { getStatusClass } = useTicketStatus();

            expect(getStatusClass(TicketStatusEnum.NEW)).toBe('new');
            expect(getStatusClass(TicketStatusEnum.IN_PROGRESS)).toBe('inprogress');
            expect(getStatusClass(TicketStatusEnum.CLOSED)).toBe('closed');
        });
    });
});
