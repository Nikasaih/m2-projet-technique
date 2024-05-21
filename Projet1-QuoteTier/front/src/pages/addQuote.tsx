import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

type QuoteForm = {
  quote: string;
  author: string;
};

const AddQuote = () => {

  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<QuoteForm>({
    defaultValues: {
      quote: '',
      author: '',
    },
  });

  const onSubmit = async (data: QuoteForm) => {
    try {
      const response = await fetch("http://localhost:5000/quotes", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Quote added:', result);
        navigate('/');
      } else {
        console.error('Failed to add quote');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="bg-white mt-5 p-6 rounded-lg shadow-md w-full max-w-md h-full">
        <h1 className="text-4xl font-bold mb-4 text-center">Add a Quote</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="quote" className="block text-sm font-medium text-gray-700">Quote</label>
            <input
              id="quote"
              {...register('quote', { required: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
            <input
              id="author"
              {...register('author', { required: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

export default AddQuote;
