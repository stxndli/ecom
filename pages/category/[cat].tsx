import Head from "next/head";
import Header from "../../components/Header";
import { db } from "../../firebase";
import {collection, getDocs, where, query, DocumentData, getDoc, doc, orderBy, Query} from "firebase/firestore"
import { Product } from "../../typings";
import Products from "../../components/Products";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";
interface Props{
    products:Product[],
    title:string
}
export default function Category({products,title}:Props){
    const router = useRouter()
    return(
        <div>
        <Head>
            <title>Ecom example</title>
            <meta name="description" content="ecommerce project" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header/>
        <div className="min-h-screen mt-24 mx-3">
            <Products products={products} title={`${title}`}/>
        </div>
        <Footer/>
        </div>
    )
}
export async function getServerSideProps(context:any){
    let products:DocumentData[] = []
    const categoryDoc = await getDoc(doc(db, "categories",context.params.cat));
    const category = categoryDoc.data()
        let sort = context.query.sort
    let q: Query<DocumentData>
    switch (sort) {
        case "priceAsc":
            q = query(collection(db, "products"),where("categories","array-contains",category!.category) , orderBy("categories"),orderBy("price","asc"));
            break;
        case "priceDesc":
            q = query(collection(db, "products"),where("categories","array-contains",category!.category) , orderBy("categories"),orderBy("price","desc"));
            break;
        case "onSale":
            q = query(collection(db, "products"),where("categories","array-contains",category!.category) , where("sale",">",0));
            break
        default:
            q = query(collection(db, "products"),where("categories","array-contains",category!.category) , where("stock",">",0));
            break;
    }
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc)=>{
        const product = doc.data()
        product.id = doc.id
        products.push(product)
    })
    return{
      props:{
        products:products,
        title:category!.title
      }
    }
  
}