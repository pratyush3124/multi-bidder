"use client"

import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client";

interface Bid {
  username: string;
  bid: number;
}

export default function Home() {
  const [currentBid, setCurrentBid] = useState<Bid | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [newBidPrice, setNewBidPrice] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const randomUsername = generateRandomUsername();
    setUsername(randomUsername);

    const newSocket = io("localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected:", newSocket.id);
    });

    newSocket.on("newBid", (bid: Bid) => {
      console.log("New bid:", bid);
      setCurrentBid(bid);
      setBids(prevBids => [bid, ...prevBids.slice(0, 4)]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleNewBid = () => {
    if (socket && newBidPrice) {
      const bidValue = parseFloat(newBidPrice);
      socket.emit("placeBid", { username, bid: bidValue });
      setNewBidPrice("");
    }
  };

  const generateRandomUsername = () => {
    const adjectives = ["happy", "lucky", "sunny", "clever", "swift"];
    const nouns = ["cat", "dog", "bird", "fish", "fox"];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
  };

  return (
    <div className="p-4">
      <h1 className="text-sm mb-4">User: {username}</h1>
      <div className={`shadow-lg rounded-lg p-6 mb-4 ${
        currentBid?.username === username ? 'bg-green-500 text-white' : 'bg-white'
      }`}>
        <h2 className="text-2xl font-bold mb-4">Current Price: ${currentBid?.bid.toFixed(2) || "0.00"}</h2>
        <h3 className="text-lg font-semibold mb-2">Last 5 Bids:</h3>
        <ul>
          {bids.map((bid, index) => (
            <li
              key={index}
              className={`p-2 mb-1 rounded ${
                index === 0 ? (bid.username === username ? "bg-green-700" : "bg-green-200 text-black") : ""
              }`}
            >
              ${bid.bid.toFixed(2)} by {bid.username}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          value={newBidPrice}
          onChange={(e) => setNewBidPrice(e.target.value)}
          placeholder="Enter bid amount"
          className="border p-2 rounded"
        />
        <button
          onClick={handleNewBid}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Place Bid
        </button>
      </div>
    </div>
  )
}
