import { Card } from "./Card";
import {Product} from "../typings"
import Link from "next/link";
import { useRouter } from 'next/router';
interface Props{
    products: Product[]
    title:string
}
export default function Products({products, title}:Props){
    const router = useRouter()
    const handleChange = (event:any) => {
        router.replace(`${router.asPath.replace(new RegExp("sort=.*"),"").replace("?","")}?sort=${event.target.value}`,undefined,{scroll:false})
    }
    return(
        <div className="mx-3 grid">
            <div className="flex flex-col md:flex-row justify-between mr-5">
                <h1 className="text-4xl mb-10">{title}</h1>
                <div className="flex">
                <h1 className="text-xl mb-10 pt-3 pr-2">Sort by:</h1>
                <select className="selectForm" onChange={handleChange} placeholder="Sort by">
                    <option selected>Default</option>
                    <option value="priceAsc">Price (ascending)</option>
                    <option value="priceDesc">Price (descending)</option>
                    <option value="onSale">On Sale</option>
                </select>
                </div>
            </div>
            {products.length>0 ? <div className="grid gap-5 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product)=>(
                    <Card product={product} key={product.id}/>
                ))}
            </div>:
             <div className="flex flex-col items-center">
             <h1 className="text-4xl mb-5 text-gray-500">Nothing here for now</h1>
         </div>}
        </div>
    )
}