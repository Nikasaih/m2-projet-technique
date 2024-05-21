export enum GameStatusType {
    CANCELED,
    PENDING,
    PLAYING_CHARGE,
    PLAYING_DECHARGE
}
export interface IPlayer {
    id:string,
    point: number
}
export interface IGame {
    players :IPlayer[]
    status:GameStatusType
    gameId:string
}