export interface Event {
    id: number;
    name: string;
    cost: number;
    maxSeats: number;
    bookedSeats: number;
    date: string;
    time: string;
    location: string;
}