export interface IPaginate <T> {
    count: number, 
    pages: number, 
    currentPgae: number, 
    limit:number, 
    docs:T[]
}