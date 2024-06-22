'use client'
import Link from 'next/link';

import s from './pagination.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';

type Props<T> = {
    links: CityData<T>['links'];
};

export default function Pagination({links}: Props<CityItem>) {
    const rawQuery = useSearchParams();
    const parsedSearchParams = new URLSearchParams(rawQuery);
    const router = useRouter();
    
    const handleNavigate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, link: string) => {
        const url = new URL(window.location.pathname, window.location.href);
        const searchParamsString = link.split('?')[1];
        const newSearchParams = new URLSearchParams(searchParamsString);

        const offset = newSearchParams.get('offset')!;
        const limit = newSearchParams.get('limit')!;
        parsedSearchParams.set('offset', offset);
        parsedSearchParams.set('limit', limit);

        url.search = parsedSearchParams.toString();
        router.replace(decodeURIComponent(url.toString()));
        // window.location.search = searchParams.toString();
    };
    
    return (
        <div className={s.pagWrapper}>
            {links[0]?.href && <button onClick={(e) => handleNavigate(e, links[0].href)} className={s.navLink}>{links[0].rel}</button>}
            {links[1]?.href && <button onClick={(e) => handleNavigate(e, links[1].href)} className={s.navLink}>{links[1].rel}</button>}
            {links[2]?.href && <button onClick={(e) => handleNavigate(e, links[2].href)} className={s.navLink}>{links[2].rel}</button>}
            {links[3]?.href && <button onClick={(e) => handleNavigate(e, links[3].href)} className={s.navLink}>{links[3].rel}</button>}
        </div>
    )
}