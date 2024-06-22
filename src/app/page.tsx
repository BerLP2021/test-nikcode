
import { getCities } from "@/actions/getCities";
import Title from "@/components/Title";
import CitiesList from "@/components/CitiesList";
import Search from "@/components/Search";

import s from "./page.module.css";
import Pagination from "@/components/Pagination";
import Sort from "@/components/Sort";

type Props = {
  searchParams: { [key: string]: string }
};

export default async function Home({searchParams}: Props) {
  const cities = await getCities(searchParams);
  console.log(cities);
  return (
    <main className={s.main}>
      <Title as="h1" text="Cities list" className={s.title} />
      <div style={{
        marginTop: '50px',
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Search />  
        <Sort /> 
      </div>
      <CitiesList cities={cities.data} />
      <Pagination links={cities.links}/>
    </main>
  );
}
