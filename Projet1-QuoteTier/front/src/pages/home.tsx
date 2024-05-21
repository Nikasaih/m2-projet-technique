import React, { useState, useEffect } from 'react';
import './home.css';

type Quote = {
  id: number;
  text: string;
  author: string;
};

const Home = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    // Simuler la récupération des données
    const fetchedQuotes: Quote[] = [
      { id: 1, text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
      { id: 2, text: "Do not watch the clock. Do what it does. Keep going.", author: "Sam Levenson" },
      { id: 3, text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
      { id: 4, text: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll" },
    ];

    setQuotes(fetchedQuotes);
  }, []);

//   useEffect(() => {
//     fetch('http://localhost:3001/quotes')
//       .then(response => response.json())
//       .then(data => setQuotes(data))
//       .catch(error => console.error('Error fetching quotes:', error));
//   }, []);

  return (
    <div className="container">
      <input type="text" placeholder="Search..." />
      <button onClick={() => alert('Create Quote button clicked!')}>
        Create Quote
      </button>
      <div className="quotes-list">
        {quotes.map((quote) => (
          <div key={quote.id} className="quote-item">
            <p className="quote-text">"{quote.text}"</p>
            <p className="quote-author">- {quote.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
