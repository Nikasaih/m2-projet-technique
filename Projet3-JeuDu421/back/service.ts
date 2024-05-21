import { GameStatusType, IGame } from "./interface"
import { redisClient } from "./redisConnection"
import { fromCombinationToPoint } from "./utils"

export const saveWebsocket = async (clientId:string, ws:WebSocket)=>{
    await redisClient.set(clientId, JSON.stringify(ws))
}

export const getWebsocket = async (clientId:string)=>{
    return await redisClient.get(clientId)
}
/** only the creator of the game can start it */
export const startGame = async (clientId:string, gameId:string)=>{
    const game = await     getGameById(gameId)
    if(game.players[0].id === clientId){
        game.status = GameStatusType.PLAYING_CHARGE
        await redisClient.set(gameId, JSON.stringify(game))
    }
}
export const createGame = async (clientId :string)=>{
    const newGame :IGame = {
        players: [{id:clientId,point:0}],
        status: GameStatusType.PENDING,
        gameId:`${Date.now()}`
    }

    await redisClient.set(newGame.gameId, JSON.stringify(newGame))

    return newGame
}
/** only the creator of the game can stop it */
export const cancelGame = async (clientId:string, gameId:string)=>{
//todo
}
const getGameById = async( gameId:string):Promise<IGame>=>{
    const gameAsJson = await redisClient.get(gameId)
    if (gameAsJson === null) {
        throw new Error ("game not found")
    }
    return  JSON.parse(gameAsJson) 
}

/** join the game and notify the other player that a new player join the party */
export const joinGame = async (clientId: string, gameId:string)=>{
    const game = await getGameById(gameId)
    game.players.push({id: clientId,point:0})
    await redisClient.set(gameId, JSON.stringify(game))

    return game
}
export const quitGame = async (clientId:string, gameId:string)=>{
    //todo
}

/** the front is the one responsible to launch the dice */
export const checkDice = async (result :number[],clientId: string, gameId:string)=>{
    const game = await getGameById(gameId)
    const player =         game.players.find((player)=>player.id === clientId)
    if(!player){
        throw new Error("player not found")
    }
    const newPoint = fromCombinationToPoint(result)

    if(game.status === GameStatusType.PLAYING_CHARGE){
        player.point += newPoint
    }
    else if(game.status === GameStatusType.PLAYING_DECHARGE){
        player.point -= newPoint
        if(player.point === 0){
            //todo change game status to finished and give the winner
        }
    }

    //todo
}