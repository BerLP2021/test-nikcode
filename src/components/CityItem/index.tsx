import Image from "next/image";
import s from "./cityItem.module.scss";

import React from 'react'
import Link from "next/link";

type Props = {city: CityItem}

export default function CityItem({city}: Props) {
  console.log(city);
    const {image, name, id, country, population, area} = city;
  return (
    <Link href={`/${id}`} className={s.cardWrapper}>
        <div className={s.imgWrapper}>
            <Image 
              src={image || '/stab/image.png'} 
              placeholder = "empty"
              alt={name} 
              fill 
              style={{
                objectFit: image ? 'cover' : 'contain'
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1199px) 50vw, 30vw"/>
        </div>
        <div className={s.content}>
            <h3 className={s.name}>City: {name}</h3>
            <p className={s.text}>Country: {country}</p>
            <p className={s.text}>Population: {population}</p>
            <p className={s.text}>Area: {area} {area ? 'sq km' : 'no data'}</p>
            <button className={s.learnBtn}>Learn more</button>
        </div>
    </Link>
  )
}