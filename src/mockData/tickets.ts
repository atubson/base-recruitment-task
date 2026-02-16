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
    },
    {
        id: 11,
        customerName: 'Grzegorz Rutkowski',
        subject: 'Problemy z logowaniem',
        description: 'Po zmianie hasła nie mogę się zalogować.',
        priority: TicketPriorityEnum.HIGH,
        status: TicketStatusEnum.NEW,
        createdAt: '2024-01-27T09:05:00'
    },
    {
        id: 12,
        customerName: 'Joanna Cieślak',
        subject: 'Błędna kwota na fakturze',
        description: 'Kwota na ostatniej fakturze jest nieprawidłowa.',
        priority: TicketPriorityEnum.MEDIUM,
        status: TicketStatusEnum.IN_PROGRESS,
        createdAt: '2024-01-26T14:20:00'
    },
    {
        id: 13,
        customerName: 'Bartłomiej Lewandowski',
        subject: 'Zgłoszenie pomysłu na funkcję',
        description: 'Proszę o dodanie możliwości filtrowania wyników.',
        priority: TicketPriorityEnum.LOW,
        status: TicketStatusEnum.NEW,
        createdAt: '2024-01-25T11:45:00'
    },
    {
        id: 14,
        customerName: 'Anna Pawlak',
        subject: 'Nie działa przypomnienie hasła',
        description: 'Nie przychodzi e-mail z linkiem do resetu hasła.',
        priority: TicketPriorityEnum.HIGH,
        status: TicketStatusEnum.CLOSED,
        createdAt: '2024-01-24T15:55:00'
    },
    {
        id: 15,
        customerName: 'Marek Król',
        subject: 'Brak dostępu do konta',
        description: 'Moje konto zostało zablokowane bez powodu.',
        priority: TicketPriorityEnum.MEDIUM,
        status: TicketStatusEnum.IN_PROGRESS,
        createdAt: '2024-01-23T10:30:00'
    },
    {
        id: 16,
        customerName: 'Maria Kowalik',
        subject: 'Niepoprawne dane w profilu',
        description: 'Po edycji profilu dane nie zapisują się prawidłowo.',
        priority: TicketPriorityEnum.LOW,
        status: TicketStatusEnum.NEW,
        createdAt: '2024-01-22T13:15:00'
    },
    {
        id: 17,
        customerName: 'Jakub Szymański',
        subject: 'Brak możliwości zmiany języka',
        description: 'Opcja zmiany języka jest nieaktywna.',
        priority: TicketPriorityEnum.LOW,
        status: TicketStatusEnum.CLOSED,
        createdAt: '2024-01-21T08:55:00'
    },
    {
        id: 18,
        customerName: 'Elżbieta Szczepańska',
        subject: 'Aplikacja zawiesza się podczas pracy',
        description: 'Podczas dodawania nowych elementów aplikacja się zawiesza.',
        priority: TicketPriorityEnum.HIGH,
        status: TicketStatusEnum.IN_PROGRESS,
        createdAt: '2024-01-20T12:10:00'
    },
    {
        id: 19,
        customerName: 'Tomasz Mazur',
        subject: 'Błąd przy generowaniu dokumentów',
        description: 'Generowane dokumenty PDF są puste.',
        priority: TicketPriorityEnum.MEDIUM,
        status: TicketStatusEnum.NEW,
        createdAt: '2024-01-19T17:45:00'
    },
    {
        id: 20,
        customerName: 'Karolina Wiśniewska',
        subject: 'Sugerowana zmiana interfejsu',
        description: 'Przyciski powinny być większe dla łatwiejszego dostępu.',
        priority: TicketPriorityEnum.LOW,
        status: TicketStatusEnum.CLOSED,
        createdAt: '2024-01-18T16:05:00'
    },
];