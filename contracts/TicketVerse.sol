// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TicketVerse is ERC721 {
    uint256 private _nextTokenId;
    address public owner;

    uint256 public totalEvents = 0;
    struct Event {
        uint256 id;
        string name;
        uint256 cost;
        uint256 maxSeats;
        uint256 bookedSeats;
        string date;
        string time;
        string location;
    }
    mapping(uint256 => Event) public events;

    mapping(uint256 => uint256[]) seatsTaken;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => mapping(uint256 => address)) public seatOwners;

    constructor() ERC721("TicketVerse", "TV") {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function createEvent(
        string memory _name,
        uint256 _cost,
        uint256 _maxSeats,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
        uint256 id = ++totalEvents;
        events[id] = Event(
            id,
            _name,
            _cost,
            _maxSeats,
            0,
            _date,
            _time,
            _location
        );
    }

    function buyTicket(uint256 _eventId, uint256 _seatId) public payable {
        require(
            hasBought[_eventId][msg.sender] == false,
            "Already bought ticket"
        );

        require(_eventId != 0, "Event does not exist");
        require(_eventId <= totalEvents, "Event does not exist");

        require(events[_eventId].cost <= msg.value, "Insufficient funds");

        require(_seatId != 0, "Seat does not exist");
        require(seatOwners[_eventId][_seatId] == address(0), "Seat taken");
        require(events[_eventId].maxSeats >= _seatId, "Seat does not exist");
        require(
            events[_eventId].maxSeats > events[_eventId].bookedSeats,
            "No seats available"
        );

        seatOwners[_eventId][_seatId] = msg.sender;
        seatsTaken[_eventId].push(_seatId);
        hasBought[_eventId][msg.sender] = true;
        events[_eventId].bookedSeats += 1;

        _safeMint(msg.sender, ++_nextTokenId);
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }
}
