'use client';

import { toast } from 'sonner';
import { ethers } from 'ethers';
import config from './config.json';
import { useState, useEffect } from 'react';
import ticketVerseABI from './abis/TicketVerse.json';
import SeatSelectionModal from './components/SeatSelectionModal';
import Ticket from './components/Ticket';

declare global {
  interface Window {
    ethereum: any
  }
}

interface Event {
  id: number;
  name: string;
  cost: number;
  maxSeats: number;
  bookedSeats: number;
  date: string;
  time: string;
  location: string;
}

const Home = () => {
  const [ticketVerseContract, setTicketVerseContract] = useState<ethers.Contract | null>(null);
  const [seatSelectionModalOpen, setSeatSelectionModalOpen] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState<boolean>(false);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [account, setAccount] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);

  async function updateAccountAddress() {
    if (!provider) return;

    try {
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const ticketVerse = new ethers.Contract(config.TicketVerse.address, ticketVerseABI, signer);
      setTicketVerseContract(ticketVerse);
    } catch (error: any) {
      setAccount(null);

      if (error.code === "ACTION_REJECTED") {
        toast('MetaMask connection rejected by user.')
      }
      else {
        toast('MetaMask connection error. Please check your MetaMask extension.')
      }
      console.error('MetaMask connection error:', error);
    }
  }

  useEffect(() => {
    updateAccountAddress();
  }, [provider]);

  async function connectMetaMask() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      window.ethereum.on('accountsChanged', updateAccountAddress);
    } else {
      toast('MetaMask is not installed. Please install it to use this feature.')
    }
  };

  useEffect(() => {
    connectMetaMask();
  }, []);

  async function getEvents() {
    if (ticketVerseContract) {
      setLoading(true);
      const totalEvents = await ticketVerseContract.totalEvents();
      const events: Event[] = [];
      for (let i = 1; i <= totalEvents; i++) {
        const event = await ticketVerseContract.events(i);
        events.push({
          id: parseInt(event.id),
          name: event.name,
          cost: parseFloat(ethers.formatUnits(event.cost, 'ether')),
          maxSeats: parseInt(event.maxSeats),
          bookedSeats: parseInt(event.bookedSeats),
          date: event.date,
          time: event.time,
          location: event.location,
        });
      }
      setEvents(events);
      setLoading(false)
    }
  }

  useEffect(() => {
    if (account) {
      getEvents();
    }
  }, [account]);

  useEffect(() => {
    const filteredEvents = events.filter((event) => {
      const matchesDate = selectedDate ? event.date === selectedDate : true;
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDate && matchesSearch;
    });
    setFilteredEvents(filteredEvents);
  }, [events, selectedDate, searchTerm]);

  const getSeatsTaken = async (eventId: number) => {
    if (!ticketVerseContract) return;

    const bookedSeats = await ticketVerseContract.getSeatsTaken(eventId);
    setBookedSeats(bookedSeats.map((seat: bigint) => seat.toString()));
  }

  const handleBuyTickets = async (event: Event) => {
    if (!ticketVerseContract) return;
    setLoading(true);

    const alreadyBooked = await ticketVerseContract.hasBought(event.id, account);
    if (alreadyBooked) {
      setTicketModalOpen(true);
    }
    else {
      getSeatsTaken(event.id);
      setSeatSelectionModalOpen(true);
    }
    setSelectedEvent(event);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V4a10 10 0 00-10 10h2zm2 8a8 8 0 018-8h2a10 10 0 00-10-10v2zm8-8a8 8 0 01-8 8V20a10 10 0 0010-10h-2z"></path>
          </svg>
        </div>
      )}
      <header className="w-full bg-indigo-600 py-4 text-center shadow-lg flex flex-col sm:flex-row justify-between items-center px-8 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-extrabold">TicketVerse</h1>
        {
          account ? (
            <div className="flex items-center space-x-4">
              <button onClick={() => { setAccount(null); }} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">Disconnect</button>
              <div className="relative hidden sm:flex flex-col items-center group">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
                <div className="absolute top-9 right-0 flex flex-col items-center hidden group-hover:flex">
                  <div className='bg-gray-800 rounded-lg p-2 shadow-lg w-48'>
                    <p className='text-white text-sm cursor-pointer hover:text-indigo-500'>Configure Sepolia Network in MetaMask</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={connectMetaMask} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">Connect MetaMask</button>
          )
        }
      </header>

      {
        !account ? (
          <div className="flex flex-col items-center w-full flex-1 px-4 sm:px-10 justify-center">
            <h2 className="text-4xl font-bold mb-2">Welcome to TicketVerse</h2>
            <p className="text-lg font-light mb-6">A decentralized ticketing platform for events.</p>

            <p className="text-lg font-light mb-6 mt-4">Connect your MetaMask wallet to view and buy tickets for events.</p>
          </div>
        ) :
          <main className="flex flex-col items-center w-full flex-1 px-4 sm:px-10 text-center mt-10">
            <section className="w-full max-w-4xl mb-10">
              <h2 className="text-4xl font-bold mb-2">Events</h2>
              <p className="text-lg font-light mb-6">Your Gateway to the World of Experiences</p>
              <div className="flex flex-col sm:flex-row justify-center mb-6">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="p-2 rounded-lg text-black w-full sm:w-64 mb-4 sm:mb-0 sm:mr-4"
                />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="p-2 rounded-lg text-black w-full sm:w-auto"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.length ?
                  filteredEvents.map((event) => (
                    <div key={event.id} className="bg-gray-800 rounded-lg shadow-lg p-6 transition transform hover:scale-105">
                      <h3 className="text-2xl font-semibold mb-2">{event.name}</h3>
                      <p className="text-gray-400">{new Date(event.date).toDateString()} at {event.time}</p>
                      <p className="text-gray-400">{event.location}</p>
                      <div className="mt-4 text-gray-200">
                        <p><span className="font-bold">Cost:</span> {event.cost}ETH</p>
                        <p><span className="font-bold">Available Seats:</span> {event.maxSeats - event.bookedSeats}</p>
                      </div>
                      { }
                      <button
                        disabled={event.maxSeats - event.bookedSeats === 0 || event.date < new Date().toISOString()}
                        onClick={() => handleBuyTickets(event)}
                        className="mt-6 bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600"
                      >
                        {event.date < new Date().toISOString() ? 'Event Passed' : event.maxSeats - event.bookedSeats === 0 ? 'Sold Out' : 'Buy Tickets'}
                      </button>
                    </div>
                  )) : (<p className="text-lg text-gray-400">No events found.</p>)}
              </div>
            </section>
          </main>
      }
      {seatSelectionModalOpen && selectedEvent && ticketVerseContract && bookedSeats && (
        <SeatSelectionModal ticketVerseContract={ticketVerseContract} event={selectedEvent} bookedSeatsList={bookedSeats} onClose={() => { setSelectedEvent(null); setSeatSelectionModalOpen(false); }} />
      )}
      {ticketModalOpen && selectedEvent && (
        <Ticket event={selectedEvent} onClose={() => { setSelectedEvent(null); setTicketModalOpen(false); }} />
      )}
    </div>
  );
};

export default Home;
