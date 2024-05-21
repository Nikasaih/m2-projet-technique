export interface IComment {
    grade:number,
    comment:string
}
export interface IQuote{
    quote: string,
    author:string,
    grade:{
        average:number|undefined,
        comments:IComment[]
    }
    id:string
}