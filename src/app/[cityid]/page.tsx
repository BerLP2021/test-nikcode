import { getCity } from "@/actions/getCities";
import Title from "@/components/Title"

import s from "./page.module.scss";
import Image from "next/image";
import Map from "@/components/Map";

type Props = {params: {
    cityid: string
}}
export default async function page({params}: Props) {
  const {area, coordinates, country, description, id, image, name, population} = await getCity(params.cityid);
    return (
    <main>
        <div className={s.imageWrapper}>
          <Image 
              src={image || '/stab/image.png'} 
              alt={name} 
              fill 
              style={{
                  objectFit: image ? 'cover' : 'contain'
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1199px) 50vw, 30vw"/>
        </div>
        <Title as='h1' text={name} className={s.name}  />
        <div className={s.contentWrapper}>
          <p className={s.text}><b>Country:</b> {country}</p>
          <p><b>Description:</b> {description}</p>
          <p className={s.text}><b>Population:</b> {population}</p>
          <p className={s.text}><b>Area:</b> {area} {area ? 'sq km' : 'no data'}</p>
          <h3 className={s.map}>Map:</h3> 
        </div>
        {(coordinates.longitude && coordinates.latitude) && (
          <div>
            <Map latitude={coordinates.latitude!} longitude={coordinates.longitude!} cityName={name}/>
          </div>
        )}
    </main>
  )
}