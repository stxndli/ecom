import {db} from "../firebase"
import { collection, doc, addDoc } from "firebase/firestore"; 
export default function Add(){
    const add = async()=>{
        const productRef = collection(db, "products");

        await addDoc(productRef, {
            name: "T-shirt", sizes: ["S","M","L"], colors: ["black", "gray"],
            price: 19.99, stock: 20, images:["https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-04.jpg"], sale:0
        });
    }
    return(
        <div>
            <button onClick={add}>add</button>
        </div>
    )
}