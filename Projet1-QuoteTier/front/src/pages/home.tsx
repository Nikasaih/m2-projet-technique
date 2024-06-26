import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./home.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faEdit, faComment, faCheckCircle  } from '@fortawesome/free-solid-svg-icons';
import { backendHost } from "../const";


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
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [authors, setAuthors] = useState<string[]>([]);

  useEffect(() => {
    fetch(backendHost+"/quotes")
      .then((response) => response.json())
      .then((data) => {
        console.table(data)
        const quotes = data.map((quote: string) => JSON.parse(quote));
        setQuotes(quotes);
      })
      .catch((error) => console.error("Error fetching quotes:", error));

    fetch(`${backendHost}/author`)
      .then((response) => response.json())
      .then((data) => {
        setAuthors(data);
      })
      .catch((error) => console.error("Error fetching authors:", error));
  }, []);

  const filteredQuotes = quotes
    .filter((quote) =>
      quote.author && quote.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.grade.likeAmmount - a.grade.likeAmmount);


  const handleLike = (id: string) => {
    fetch(backendHost+'/like', {
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
    fetch(backendHost+'/dislike', {
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

  const handleCommentChange = (id: string, newComment: string) => {
    setComments({ ...comments, [id]: newComment });
  };

  const handleCommentSubmit = (id: string) => {
    const commentText = comments[id];
    if (!commentText) return;

    fetch(backendHost+'/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quoteId: id, comment: commentText })
    })
    .then(response => response.json())
    .then(updatedQuote => {
      setQuotes(quotes.map(quote => quote.id === updatedQuote.id ? updatedQuote : quote));
      setComments({ ...comments, [id]: '' }); // Clear the comment input
    })
    .catch(error => console.error('Error commenting on quote:', error));
  };

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search by author"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="quotes-list">
        {filteredQuotes.map((quote) => (
          <div key={quote.id} className="quote-item">
            <p className="quote-text">"{quote.quote}"</p>            
            <p className="quote-author text-sm text-gray-700">
              - {quote.author}
              {authors.includes(quote.author) && (
                <FontAwesomeIcon icon={faCheckCircle} color="green" className="ml-2" />
              )}
            </p>
            <p className="mb-5">
              <span className="text-green-700 font-semibold mr-5">{quote.grade.likeAmmount}</span>
              -
              <span className="text-red-700 font-semibold ml-5 mr-5">{quote.grade.dislikeAmmount}</span>
            </p>
            <hr />
            <div>
            <button onClick={() => handleLike(quote.id)} data-testid={`like-button-${quote.id}`} className="bg-white text-white px-3 py-2 rounded hover:bg-gray-200 mr-2"><FontAwesomeIcon icon={faThumbsUp} color="green" /></button>
            <button onClick={() => handleDislike(quote.id)} data-testid={`dislike-button-${quote.id}`} className="bg-white text-white px-3 py-2 rounded hover:bg-gray-200 mr-10"><FontAwesomeIcon icon={faThumbsDown} color="red" /></button> 
            <input
                type="text"
                placeholder="Add a comment..."
                value={comments[quote.id] || ''}
                onChange={(e) => handleCommentChange(quote.id, e.target.value)}
                className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button id="btnAddComment" data-testid={`add-comment-button-${quote.id}`} onClick={() => handleCommentSubmit(quote.id)} className="ml-2 px-4 py-2 bg-white text-white rounded-md hover:bg-gray-200">
                <FontAwesomeIcon icon={faComment} color="orange"/>
              </button>
            </div>
            {quote.comments.length > 0 && (
              <div className="mt-4 bg-gray-100 p-4 rounded-md shadow-inner">
                <h4 className="text-md font-semibold mb-2">Comments:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {quote.comments.map((comment, index) => (
                    <li key={index} className="text-sm text-gray-700">{comment}</li>
                  ))}
                </ul>
              </div>
            )}         
            <hr className="mb-5" />
            <Link to={`/edit-quote/${quote.id}`} className="bg-blue-500 text-white px-3 py-2 mt-5 rounded hover:bg-blue-600"><FontAwesomeIcon icon={faEdit} /></Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
