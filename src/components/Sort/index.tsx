'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import s from './sort.module.scss';

type Props = {}

export default function Sort({}: Props) {
        const rawQuery = useSearchParams();
        const searchParams = new URLSearchParams(rawQuery);
        const router = useRouter();
        const sortValues = ['', 'population', 'name'];
    
        const [selectedOption, setSelectedOption] = useState<number>(0);

        const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedOption(+event.target.value);
            
        };
        useEffect(() => {
            const sort = sortValues[selectedOption];

            if (sort) {
            searchParams.has('sort')
                ? searchParams.set('sort', sort)
                : searchParams.append('sort', sort);
            } else {
                searchParams.delete('sort');
            }
            const url = new URL(window.location.pathname, window.location.href);
            url.search = searchParams.toString();
            console.log(url.toString());
            console.log(decodeURIComponent(url.toString()));
            router.push(decodeURIComponent(url.toString()));

        }, [selectedOption]);
    
        return (
            <form 
                className={s.form}
                // action={}
            >
                <fieldset className={s.fieldset}>
                    <legend>Sort by: </legend>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value=""
                                checked={selectedOption === 0}
                                onChange={handleOptionChange}
                            />
                            none
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="1"
                                checked={selectedOption === 1}
                                onChange={handleOptionChange}
                            />
                            population
                        </label>
                    </div>
                    <div>
                        <label>
                        <input
                            type="radio"
                            value="2"
                            checked={selectedOption === 2}
                            onChange={handleOptionChange}
                        />
                        name
                        </label>
                    </div>
                </fieldset>
            </form>
        );
    }
    