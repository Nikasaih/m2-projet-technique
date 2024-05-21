export interface IComment {
    grade:number,
    comment:string
}
export interface IQuote{
    quote: string,
    author:string,
    grade:{
        likeAmmount:number,
        dislikeAmmount:number,
    }
    id:string
}