import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/home';
import { backendHost } from '../const';


global.fetch = jest.fn();

const getById = (container: HTMLElement, id: string) => container.querySelector(`#${id}`);

const mockQuotes = [
  {
    id: '1',
    author: 'Author 1',
    quote: 'Quote 1',
    grade: { dislikeAmmount: 1, likeAmmount: 5 },
    comments: ['Comment 1']
  },
  {
    id: '2',
    author: 'Author 2',
    quote: 'Quote 2',
    grade: { dislikeAmmount: 2, likeAmmount: 3 },
    comments: []
  }
];

describe('Home Component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockQuotes.map(quote => JSON.stringify(quote)))
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Doit récupérer et afficher les quotes', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('"Quote 1"')).toBeInTheDocument();
      expect(screen.getByText('- Author 1')).toBeInTheDocument();
      expect(screen.getByText('"Quote 2"')).toBeInTheDocument();
      expect(screen.getByText('- Author 2')).toBeInTheDocument();
    });
  });

  it('Doit filtrer les quotes selon l\'auteur', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('"Quote 1"')).toBeInTheDocument();
      expect(screen.getByText('- Author 1')).toBeInTheDocument();
      expect(screen.getByText('"Quote 2"')).toBeInTheDocument();
      expect(screen.getByText('- Author 2')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Search by author'), {
      target: { value: 'Author 1' }
    });

    expect(screen.queryByText('"Quote 2"')).not.toBeInTheDocument();
    expect(screen.getByText('"Quote 1"')).toBeInTheDocument();
  });

  it('Doit pouvoir like une quote', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          ...mockQuotes[0],
          grade: { ...mockQuotes[0].grade, likeAmmount: mockQuotes[0].grade.likeAmmount + 1 }
        })
      })
    );

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('"Quote 1"')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('like-button-1'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${backendHost}/like`, expect.any(Object));
      expect(screen.getByText('6')).toBeInTheDocument();
    });
  });

  it('Doit pouboir disliker une quote', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          ...mockQuotes[0],
          grade: { ...mockQuotes[0].grade, dislikeAmmount: mockQuotes[0].grade.dislikeAmmount + 1 }
        })
      })
    );

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('"Quote 1"')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('dislike-button-1'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${backendHost}/dislike`, expect.any(Object));
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('Doit ajouter un commentaire à une quote', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          ...mockQuotes[0],
          comments: [...mockQuotes[0].comments, 'New Comment']
        })
      })
    );
  
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByText('"Quote 1"')).toBeInTheDocument();
    });
  
    fireEvent.change(screen.getAllByPlaceholderText('Add a comment...')[0], {
      target: { value: 'New Comment' }
    });
    fireEvent.click(screen.getByTestId('add-comment-button-1'));
  
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${backendHost}/comment`, expect.any(Object));
      expect(screen.getByText('New Comment')).toBeInTheDocument();
    });
  });
});
