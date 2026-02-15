import type { ITicket } from '@/types';
import { TicketPriorityEnum } from '@/enum/TicketPriorityEnum';
import { TicketStatusEnum } from '@/enum/TicketStatusEnum';

export const mockedTickets: ITicket[] = [
    {
        id: 1,
        customerName: "Jan Kowalski",
        subject: "Problem z logowaniem",
        description: "Nie mogę się zalogować do systemu od wczoraj.",
        priority: TicketPriorityEnum.HIGH,
        status: TicketStatusEnum.NEW,
        createdAt: "2024-02-06T10:30:00"    
    },
    {
        id: 2,
        customerName: 'Anna Nowak',
        subject: 'Błąd przy płatności',
        description: 'System odrzuca moją kartę płatniczą.',
        priority: TicketPriorityEnum.HIGH,
        status: TicketStatusEnum.IN_PROGRESS,
        createdAt: '2024-02-05T09:15:00'
      },
    {
        id: 3,
        customerName: 'Piotr Wiśniewski',
        subject: 'Zmiana hasła',
        description: 'Nie otrzymuję maila do resetu hasła.',
        priority: TicketPriorityEnum.MEDIUM,
        status: TicketStatusEnum.NEW,
        createdAt: '2024-02-04T14:20:00'
    },
    {
        id: 4,
        customerName: 'Katarzyna Zielińska',
        subject: 'Problem z fakturą',
        description: 'Na fakturze widnieje niepoprawna kwota.',
        priority: TicketPriorityEnum.MEDIUM,
        status: TicketStatusEnum.CLOSED,
        createdAt: '2024-02-03T11:45:00'
    },
    {
        id: 5,
        customerName: 'Tomasz Lewandowski',
        subject: 'Nie działa aplikacja mobilna',
        description: 'Aplikacja wyłącza się po uruchomieniu.',
        priority: TicketPriorityEnum.HIGH,
        status: TicketStatusEnum.IN_PROGRESS,
        createdAt: '2024-02-02T16:30:00'
    },
    {
        id: 6,
        customerName: 'Magdalena Wójcik',
        subject: 'Brak dostępu do raportów',
        description: 'Nie widzę raportów w panelu administratora.',
        priority: TicketPriorityEnum.LOW,
        status: TicketStatusEnum.NEW,
        createdAt: '2024-02-01T08:10:00'
    },
    {
        id: 7,
        customerName: 'Paweł Kamiński',
        subject: 'Błąd 500 na stronie',
        description: 'Podczas wchodzenia w zakładkę pojawia się błąd 500.',
        priority: TicketPriorityEnum.HIGH,
        status: TicketStatusEnum.IN_PROGRESS,
        createdAt: '2024-01-31T13:00:00'
    },
    {
        id: 8,
        customerName: 'Agnieszka Dąbrowska',
        subject: 'Aktualizacja danych',
        description: 'Nie mogę zaktualizować swoich danych kontaktowych.',
        priority: TicketPriorityEnum.LOW,
        status: TicketStatusEnum.CLOSED,
        createdAt: '2024-01-30T10:00:00'
    },
    {
        id: 9,
        customerName: 'Michał Kaczmarek',
        subject: 'Problem z eksportem danych',
        description: 'Eksport do CSV nie działa poprawnie.',
        priority: TicketPriorityEnum.MEDIUM,
        status: TicketStatusEnum.NEW,
        createdAt: '2024-01-29T17:25:00'
    },
    {
        id: 10,
        customerName: 'Ewa Piotrowska',
        subject: 'Powiadomienia nie przychodzą',
        description: 'Nie otrzymuję powiadomień e-mail.',
        priority: TicketPriorityEnum.MEDIUM,
        status: TicketStatusEnum.CLOSED,
        createdAt: '2024-01-28T12:40:00'
    }
];