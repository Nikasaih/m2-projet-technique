import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

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

type FormValues = {
  author: string;
  quote: string;
};

const EditQuote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const { register, handleSubmit, setValue } = useForm<FormValues>();

  useEffect(() => {
    fetch(`http://localhost:5000/quotes/${id}`)
      .then(response => response.json())
      .then(data => {
        setQuote(data);
        setValue('author', data.author);
        setValue('quote', data.quote);
      })
      .catch(error => console.error('Error fetching quote:', error));
  }, [id, setValue]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    fetch(`http://localhost:5000/quotes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...quote, author: data.author, quote: data.quote })
    })
      .then(response => response.json())
      .then(updatedQuote => {
        navigate('/');
      })
      .catch(error => console.error('Error updating quote:', error));
  };

  if (!quote) return <div>Loading...</div>;

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="bg-white mt-5 p-6 rounded-lg shadow-md w-full max-w-md h-full">
        <h1 className="text-4xl font-bold mb-4 text-center">Edit a Quote</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            {...register('author')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quote</label>
          <textarea
            {...register('quote')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditQuote;
