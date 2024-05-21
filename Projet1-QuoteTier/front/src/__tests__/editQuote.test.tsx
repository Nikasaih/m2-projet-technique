import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import EditQuote from '../pages/editQuote';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

const mockNavigate = useNavigate as jest.Mock;
const mockUseParams = useParams as jest.Mock;

describe('EditQuote Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockUseParams.mockReturnValue({ id: '1' });
  });

  it('Doit récupérer et afficher la quote a modifier', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: '1',
          author: 'Test Author',
          quote: 'Test Quote',
          grade: { dislikeAmmount: 0, likeAmmount: 0 },
          comments: []
        }),
      })
    ) as jest.Mock;

    render(
        <EditQuote />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText('Author')).toHaveValue('Test Author');
      expect(screen.getByLabelText('Quote')).toHaveValue('Test Quote');
    });
  });

  it('Doit envoyer le formulaire de modification d\'une quote et redirigé vers la home page', async () => {
    mockNavigate.mockImplementation(() => {});

    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: '1',
            author: 'Test Author',
            quote: 'Test Quote',
            grade: { dislikeAmmount: 0, likeAmmount: 0 },
            comments: []
          }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        })
      );

    render(
        <EditQuote />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Author')).toHaveValue('Test Author');
      expect(screen.getByLabelText('Quote')).toHaveValue('Test Quote');
    });

    fireEvent.change(screen.getByLabelText('Author'), { target: { value: 'Updated Author' } });
    fireEvent.change(screen.getByLabelText('Quote'), { target: { value: 'Updated Quote' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5002/quotes/1', expect.any(Object));
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('Doit afficher une erreur lorsque la récupération échoue', async () => {
    console.error = jest.fn();

    global.fetch = jest.fn(() =>
      Promise.reject('Fetch error')
    ) as jest.Mock;

    render(
        <EditQuote />
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching quote:', 'Fetch error');
    });
  });

  it('Doit afficher une erreur lorsque l\'envoie échoue', async () => {
    console.error = jest.fn();

    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: '1',
            author: 'Test Author',
            quote: 'Test Quote',
            grade: { dislikeAmmount: 0, likeAmmount: 0 },
            comments: []
          }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.reject(new TypeError('response.json is not a function')),
        })
      );

    render(
        <EditQuote />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Author')).toHaveValue('Test Author');
      expect(screen.getByLabelText('Quote')).toHaveValue('Test Quote');
    });

    fireEvent.change(screen.getByLabelText('Author'), { target: { value: 'Updated Author' } });
    fireEvent.change(screen.getByLabelText('Quote'), { target: { value: 'Updated Quote' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5002/quotes/1', expect.any(Object));
      expect(console.error).toHaveBeenCalledWith('Error updating quote:', expect.any(TypeError));
    });
  });
});
