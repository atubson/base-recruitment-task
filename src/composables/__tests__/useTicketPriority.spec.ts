import { describe, it, expect } from 'vitest';
import { useTicketPriority } from '../useTicketPriority';
import { TicketPriorityEnum } from '@/enum/TicketPriorityEnum';

describe('useTicketPriority', () => {
    it('should return getReadablePriority function', () => {
        const { getReadablePriority } = useTicketPriority();

        expect(typeof getReadablePriority).toBe('function');
    });

    it('should return correct Polish labels for all priority values', () => {
        const { getReadablePriority } = useTicketPriority();

        expect(getReadablePriority(TicketPriorityEnum.LOW)).toBe('Niski');
        expect(getReadablePriority(TicketPriorityEnum.MEDIUM)).toBe('Średni');
        expect(getReadablePriority(TicketPriorityEnum.HIGH)).toBe('Wysoki');
    });

    it('should return the raw value when priority is unknown', () => {
        const { getReadablePriority } = useTicketPriority();

        const unknownPriority = 'unknown' as TicketPriorityEnum;

        expect(getReadablePriority(unknownPriority)).toBe('unknown');
    });
});
