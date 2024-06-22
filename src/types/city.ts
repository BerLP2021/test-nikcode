type CityItemGeo = {
    id:number,
    wikiDataId: string,
    city:string,
    name:string,
    country:string,
    countryCode:string,
    region:string,
    latitude:number,
    longitude:number,
    population: number
}

type CityItem = {
    id: string,
    name: string;
    description: string;
    country: string;
    population: number | string;
    area: number | string;
    image: string;
    coordinates: {
        latitude:number | undefined;
        longitude:number | undefined
    };

}
type CityData<T>  = {
    data: Array<T>;
    links: Array<{
        rel: string,
        href: string
    }>;
    metadata: {
        currentOffset: number,
        totalCount: number,
    }
}