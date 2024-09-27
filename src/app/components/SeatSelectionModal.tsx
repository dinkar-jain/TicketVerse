import { ethers } from 'ethers';
import { toast } from 'sonner';
import React from 'react';

interface SeatSelectionModalProps {
    ticketVerseContract: ethers.Contract;
    event: {
        id: number;
        name: string;
        cost: number;
        maxSeats: number;
        bookedSeats: number;
        date: string;
        time: string;
        location: string;
    };
    bookedSeatsList: string[];
    onClose: () => void;
}

const generateSeatLayout = (totalSeats: number) => {
    const seatsPerRow = 7;
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let seatNumber = 1;

    for (let i = 0; i < totalSeats; i++) {
        if (i > 0 && i % seatsPerRow === 0) {
            rows.push(currentRow);
            currentRow = [];
        }
        currentRow.push(`${seatNumber++}`);
    }

    if (currentRow.length > 0) {
        rows.push(currentRow);
    }

    return rows;
};

const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({ ticketVerseContract, event, bookedSeatsList, onClose }) => {
    const [seatLayout, setSeatLayout] = React.useState<string[][]>([]);
    const [selectedSeat, setSelectedSeat] = React.useState<string | null>(null);

    React.useEffect(() => {
        setSeatLayout(generateSeatLayout(event.maxSeats));
    }, [event.maxSeats]);

    const handleSeatSelection = (seat: string) => {
        const options = { value: ethers.parseEther(event.cost.toString()) };
        ticketVerseContract.buyTicket(event.id, seat, options).then(() => {
            toast(`Seat ${seat} booked successfully!`);
            onClose();
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-lg p-8 w-11/12 max-w-4xl shadow-2xl">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Select Seats for {event.name}</h2>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                        <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                </div>
                <div className="relative overflow-hidden p-5 bg-gray-200 rounded-lg mb-6">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-12 bg-gray-400 rounded-b-full shadow-md"></div>
                    <div className="mt-16 overflow-auto max-h-60">
                        {seatLayout.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex justify-center gap-2 mb-2">
                                {row.map((seat, seatIndex) => (
                                    <button
                                        key={seatIndex}
                                        className={`p-3 rounded-lg transition duration-200 shadow-sm 
                                            ${bookedSeatsList.includes(seat) ? 'bg-gray-400 text-gray-600 cursor-not-allowed' :
                                                selectedSeat === seat ? 'bg-gray-900 text-white' :
                                                    'bg-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white'
                                            }`}
                                        onClick={() => setSelectedSeat(seat)}
                                        disabled={bookedSeatsList.includes(seat)}
                                    >
                                        Seat {seat}
                                    </button>
                                ))}
                            </div>
                        ))}
                        <div className="w-full h-4 bg-gray-300 rounded mt-4"></div> {/* Walkway */}
                    </div>
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={() => handleSeatSelection(selectedSeat as string)}
                        className={`${selectedSeat ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'} text-white px-4 py-2 rounded-lg transition duration-200`}
                        disabled={!selectedSeat}
                    >
                        Book Seat
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionModal;
