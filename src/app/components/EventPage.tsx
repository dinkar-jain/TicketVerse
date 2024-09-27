import { Event } from '../types';

export default function EventPage(props: {
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
    selectedDate: string;
    setSelectedDate: (selectedDate: string) => void;
    filteredEvents: Event[];
    handleBuyTickets: (event: Event) => void;
    setAccount: (account: string | null) => void;
}) {
    const { loading, searchTerm, setSearchTerm, selectedDate, setSelectedDate, filteredEvents, handleBuyTickets, setAccount } = props;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {loading && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <svg className="animate-spin h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}

            <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-200">
                <a className="flex items-center justify-center" href="#">
                    <svg className="h-8 w-8 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                        <line x1="6" y1="6" x2="6" y2="6"></line>
                        <line x1="6" y1="18" x2="6" y2="18"></line>
                    </svg>
                    <span className="ml-2 text-2xl font-bold text-gray-800">TicketVerse</span>
                </a>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <button
                        onClick={() => setAccount(null)}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
                    >
                        Disconnect
                    </button>
                    <div className="hidden sm:block relative group">
                        <svg className="w-5 h-5 text-gray-600 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl z-20 hidden group-hover:block border border-gray-200">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Configure Sepolia Network in MetaMask
                            </a>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="flex-1 py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6 mx-auto">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-gray-900">
                        Discover Exciting Events
                    </h1>
                    <div className="flex flex-col sm:flex-row justify-center mb-8 gap-4">
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="flex h-10 w-full sm:w-64 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900"
                        />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(event) => setSelectedDate(event.target.value)}
                            className="flex h-10 w-full sm:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900"
                        />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.length ? (
                            filteredEvents.map((event) => (
                                <div key={event.id} className="flex flex-col space-y-2 border border-gray-200 p-6 rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
                                    <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                                    <p className="text-sm text-gray-600">{new Date(event.date).toDateString()} at {event.time}</p>
                                    <p className="text-sm text-gray-600">{event.location}</p>
                                    <div className="text-sm text-gray-600">
                                        <p><span className="font-semibold">Cost:</span> {event.cost} ETH</p>
                                        <p><span className="font-semibold">Available Seats:</span> {event.maxSeats - event.bookedSeats}</p>
                                    </div>
                                    <button
                                        disabled={event.maxSeats - event.bookedSeats === 0 || new Date(event.date) < new Date()}
                                        onClick={() => handleBuyTickets(event)}
                                        className="mt-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-gray-900 text-white hover:bg-gray-800 h-10 py-2 px-4"
                                    >
                                        {new Date(event.date) < new Date() ? 'Event Passed' : event.maxSeats - event.bookedSeats === 0 ? 'Sold Out' : 'Buy Tickets'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-lg text-gray-600">No events found.</p>
                        )}
                    </div>
                </div>
            </main>

            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                    © 2024 TicketVerse. All rights reserved.
                </p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <a className="text-xs text-gray-600 hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </a>
                    <a className="text-xs text-gray-600 hover:underline underline-offset-4" href="#">
                        Privacy
                    </a>
                </nav>
            </footer>
        </div>
    );
}