'use client'
import s from './search.module.scss';

import React from 'react'

type Props = {}

export default function Search({}: Props) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input type="search" className={s.input}/>
      <button type='submit' className={s.searchBtn}>Search</button>
    </form>
  )
}