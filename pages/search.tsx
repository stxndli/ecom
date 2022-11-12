import Head from "next/head";
import Header from "../components/Header";
import { db } from "../firebase";
import {collection, getDocs, where, query, DocumentData} from "firebase/firestore"
import { Product } from "../typings";
import Products from "../components/Products";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
interface Props{
    products:Product[],
    query:string
}
export default function Category({products,query}:Props){
    const router = useRouter()
    return(
        <div>
        <Head>
            <title>Ecom Project</title>
            <meta name="description" content="ecommerce project" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header/>
        <div className="min-h-screen mt-24 mx-3">
            <Products products={products} title={`Results for: ${query}`}/>
        </div>
        <Footer/>
        </div>
    )
}
export async function getServerSideProps({query:urlQuery}:any){
    if(!urlQuery){
        return{
            props:{
              products:[],
              category:""
            }
          }
    }
    let products:DocumentData[] = []
    const q = query(collection(db,"products"), where("name","==",urlQuery.q))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc)=>{
        const product = doc.data()
        product.id = doc.id
        products.push(product)
    })
    return{
      props:{
        products:products,
        query:urlQuery.q
      }
    }
  
}