import Head from 'next/head'
import Banner from '../components/Banner'
import Categories from '../components/Categories'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Products from '../components/Products'
import {db} from "../firebase"
import {collection, getDocs, query, where, DocumentData, orderBy, Query, limit} from "firebase/firestore"
import { Category, Product } from '../typings'
interface Props{
  products:Product[],
  categories:Category[],
  categoriesAll:Category[]
}
export default function Home({products,categories,categoriesAll}:Props) {
  return (
    <div className="space-y-10">
      <Head>
        <title>Ecom Project</title>
        <meta name="description" content="ecommerce project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <Categories categories={categoriesAll}/>
      <h1 className="text-4xl mx-3">Browse by category</h1>
      <div className="flex flex-wrap justify-center md:flex-nowrap gap-x-5 mx-5">
        {
          categories.map((e)=>(
            <Banner title={e.title} image={e.image} category={e.category} id={e.id}/>
          ))
        }
      </div>
      <Products products={products} title="Latest products"/>
      <Footer/>
    </div>
  )
}
export async function getServerSideProps(context:any){
  let sort = context.query.sort
  let q: Query<DocumentData>
  switch (sort) {
    case "priceAsc":
      q = query(collection(db, "products"), orderBy("price","asc"));
      break;
    case "priceDesc":
      q = query(collection(db, "products"), orderBy("price", "desc"));
      break;
    case "onSale":
      q = query(collection(db, "products"), where("sale", ">", 0));
      break;
    default:
      q = query(collection(db, "products"), where("stock", ">", 0));
      break;
  }
  let products:DocumentData[] = []
  let categories:DocumentData[] = []
  let categoriesAll:DocumentData[] = []
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const product = doc.data()
    product.id = doc.id
    products.push(product)
  });

  querySnapshot = await getDocs(query(collection(db,"categories"), where("image","!=",""),limit(3)))
  querySnapshot.forEach((doc) => {
    const category = doc.data()
    category.id = doc.id
    categories.push(category)
  });

  querySnapshot = await getDocs(collection(db,"categories"))
  querySnapshot.forEach((doc) => {
    const category = doc.data()
    category.id = doc.id
    categoriesAll.push(category)
  });
  return{
    props:{
      products:products,
      categories:categories,
      categoriesAll:categoriesAll
    }
  }
}
