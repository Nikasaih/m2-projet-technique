import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";

type Quote = {
  id: number;
  quote: string;
  author: string;
};

const Home = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateQuote = () => {
    navigate("/add-quote");
  };

  useEffect(() => {
    fetch("http://localhost:5000/quotes")
      .then((response) => response.json())
      .then((data) => {
        const quotes = data.map((quote: string) => JSON.parse(quote));
        setQuotes(quotes);
      })
      .catch((error) => console.error("Error fetching quotes:", error));
  }, []);

  const filteredQuotes = quotes.filter((quote) =>
    quote.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleCreateQuote}>Create Quote</button>
      <div className="quotes-list">
        {filteredQuotes.map((quote) => (
          <div key={quote.id} className="quote-item">
            <p className="quote-text">"{quote.quote}"</p>
            <p className="quote-author">- {quote.author}</p>
            <Link to={`/edit-quote/${quote.id}`} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
