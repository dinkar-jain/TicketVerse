'use client';

import SeatSelectionModal from './components/SeatSelectionModal';
import ticketVerseABI from './abis/TicketVerse.json';
import LandingPage from './components/LandingPage';
import EventPage from './components/EventPage';
import { useState, useEffect } from 'react';
import Ticket from './components/Ticket';
import config from './config.json';
import { ethers } from 'ethers';
import { Event } from './types';
import { toast } from 'sonner';

declare global {
  interface Window {
    ethereum: any
  }
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
    <>
      {
        !account ? (
          <LandingPage connectMetaMask={connectMetaMask} />
        ) :
          <EventPage
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            filteredEvents={filteredEvents}
            handleBuyTickets={handleBuyTickets}
            setAccount={setAccount}
          />
      }
      {seatSelectionModalOpen && selectedEvent && ticketVerseContract && bookedSeats && (
        <SeatSelectionModal ticketVerseContract={ticketVerseContract} event={selectedEvent} bookedSeatsList={bookedSeats} onClose={() => { setSelectedEvent(null); setSeatSelectionModalOpen(false); }} />
      )}
      {ticketModalOpen && selectedEvent && (
        <Ticket event={selectedEvent} onClose={() => { setSelectedEvent(null); setTicketModalOpen(false); }} />
      )}
    </>
  );
};

export default Home;
