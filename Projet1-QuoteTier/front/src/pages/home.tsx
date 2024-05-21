import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faEdit } from '@fortawesome/free-solid-svg-icons';


type Quote = {
  id: string;
  author: string;
  quote: string;
  grade: {
    dislikeAmmount: number;
    likeAmmount: number;
  };
  comments: string[];
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

  const filteredQuotes = quotes
    .filter((quote) =>
      quote.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.grade.likeAmmount - a.grade.likeAmmount);

  const handleLike = (id: string) => {
    fetch('http://localhost:5000/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quoteId: id })
    })
    .then(response => response.json())
    .then(updatedQuote => {
      setQuotes(quotes.map(quote => quote.id === updatedQuote.id ? updatedQuote : quote));
    })
    .catch(error => console.error('Error liking quote:', error));
  };

  const handleDislike = (id: string) => {
    fetch('http://localhost:5000/dislike', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quoteId: id })
    })
    .then(response => response.json())
    .then(updatedQuote => {
      setQuotes(quotes.map(quote => quote.id === updatedQuote.id ? updatedQuote : quote));
    })
    .catch(error => console.error('Error disliking quote:', error));
  };

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
            <span className="text-green-700 font-semibold mr-5">Likes: {quote.grade.likeAmmount}</span>
            <span className="text-red-700 font-semibold mr-5">Dislikes: {quote.grade.dislikeAmmount}</span>
            <br /><br />
            <button onClick={() => handleLike(quote.id)} className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 mr-10"><FontAwesomeIcon icon={faThumbsUp} /></button>
            <button onClick={() => handleDislike(quote.id)} className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 mr-20"><FontAwesomeIcon icon={faThumbsDown} /></button>            
            <Link to={`/edit-quote/${quote.id}`} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"><FontAwesomeIcon icon={faEdit} /></Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
