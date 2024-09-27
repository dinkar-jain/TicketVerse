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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" data-id="4">
                        <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Ticket for {event.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{new Date(event.date).toDateString()} at {event.time}</p>
                <p className="text-sm text-gray-600 mb-4">{event.location}</p>
                <div className="mb-4">
                    <p className="text-sm text-gray-600"><span className="font-semibold">Cost:</span> {event.cost} ETH</p>
                </div>
                <button
                    onClick={onClose}
                    className="w-full mt-6 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-gray-900 text-white hover:bg-gray-800 h-10 py-2 px-4"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Ticket;
