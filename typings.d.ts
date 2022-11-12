export interface Product{
    oldPrice: number
    id:string
    name:string,
    price:number,
    stock:number,
    sizes:string[],
    colors:string[],
    images:string[],
    sale:number
}
export interface Category{
    id:string
    title:string,
    image:string,
    category:string
}
export interface ICartItem{
    product:Product,
    quantity:number,
    size:string,
    color:string,
}