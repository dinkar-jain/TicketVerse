import React from 'react';

interface TicketProps {
    event: {
        name: string;
        cost: number;
        date: string;
        time: string;
        location: string;
    }
    onClose: () => void;
}

const Ticket: React.FC<TicketProps> = ({ event, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 max-w-3xl text-white relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 transition"
                >
                    &times;
                </button>
                <h2 className="text-3xl font-bold mb-4">Your Ticket for {event.name}</h2>
                <p className="text-gray-400 mb-4">{new Date(event.date).toDateString()} at {event.time}</p>
                <p className="text-gray-400 mb-4">{event.location}</p>
                <div className="mb-4">
                    <p className="text-gray-200"><span className="font-bold">Cost:</span> {event.cost}ETH</p>
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Ticket;
