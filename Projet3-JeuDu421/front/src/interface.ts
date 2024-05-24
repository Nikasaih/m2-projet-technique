import React from 'react';

export enum GameStatusType {
    CANCELED,
    PENDING,
    PLAYING_CHARGE,
    PLAYING_DECHARGE,
    FINISHED
}

export interface IPlayer {
    id:string,
    point: number
}

export interface IGame {
    players :IPlayer[]
    status:GameStatusType
    gameId:string,
    pot: number,
    playerIdToPlay:string
}

export const GameContext = React.createContext<{ game: IGame | null, setGame: React.Dispatch<React.SetStateAction<IGame | null>> | null }>({ game: null, setGame: null });