import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useNavigate } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import AddQuote from '../pages/addQuote';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

const navigate = useNavigate as jest.Mock;

beforeAll(() => {
  fetchMock.enableMocks();
});

afterEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();  // Ensure all mocks are cleared between tests
});

describe('AddQuote Component', () => {
  it('Doit render le composant correctement', () => {
    render(<AddQuote />);
    expect(screen.getByText('Add a Quote')).toBeInTheDocument();
    expect(screen.getByLabelText('Quote')).toBeInTheDocument();
    expect(screen.getByLabelText('Author')).toBeInTheDocument();
  });

  it('Doit envoyer le formulaire correctement et rediriger vers home page', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ id: '1', quote: 'Test Quote', author: 'Test Author' }));

    render(<AddQuote />);

    fireEvent.change(screen.getByLabelText('Quote'), { target: { value: 'Test Quote' } });
    fireEvent.change(screen.getByLabelText('Author'), { target: { value: 'Test Author' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:5000/quotes',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quote: 'Test Quote', author: 'Test Author' }),
        })
      );
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalled();
    });
  });

  it('Doit causé une erreur lors de l\'envoi du formulaire', async () => {
    fetchMock.mockRejectOnce(new Error('Failed to add quote'));

    console.error = jest.fn();

    render(<AddQuote />);

    fireEvent.change(screen.getByLabelText('Quote'), { target: { value: 'Test Quote' } });
    fireEvent.change(screen.getByLabelText('Author'), { target: { value: 'Test Author' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error:', new Error('Failed to add quote'));
    });
  });

  it('Doit gérer correctement les erreurs du à l\'API', async () => {
    fetchMock.mockRejectOnce(new Error('API is down'));

    console.error = jest.fn();

    render(<AddQuote />);

    fireEvent.change(screen.getByLabelText('Quote'), { target: { value: 'Test Quote' } });
    fireEvent.change(screen.getByLabelText('Author'), { target: { value: 'Test Author' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error:', new Error('API is down'));
    });
  });
});
