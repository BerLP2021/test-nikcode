import React from 'react'

import s from "./citiesList.module.scss";
import CityItem from '../CityItem';

type Props = {cities: CityItem[]};

export default function CitiesList({cities}: Props) {

  return (
    <div className={s.listWrapper}>
      {cities.map(city => <CityItem city={city} key={city.id}/>)}
    </div>
  )
}