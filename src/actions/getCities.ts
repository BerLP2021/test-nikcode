'use server';
const geoUrl = process.env.GEO_CITIES_API;
const GEO_KEY = process.env.X_RAPIDAPI_KEY;
const wikiUrl = process.env.WIKIDATA_API;

async function getGeoDataCities(limit?: number, offset?: number, sort?: number): Promise<CityData<CityItemGeo>> {
    const headers = new Headers();
    headers.append("X-RapidAPI-Key", GEO_KEY as string);
    headers.append("X-RapidAPI-Host", "wft-geo-db.p.rapidapi.com");
    try{
        const res: Response = await fetch((geoUrl + `/cities?offset=${offset || 0}&limit=${limit || 9}&sort=${sort ? sort : ''}`), {
            method: "GET",
            headers
        });
        return await res.json();
    } catch(e) {
        console.error("Error fetching data from GeoDB Cities", e);
        return {data: [], links: [], metadata: {currentOffset: 0, totalCount: 0}};
    }
}

async function getGeoDataCity(idForWikiData: string): Promise<CityItemGeo> {
    const headers = new Headers();
    headers.append("X-RapidAPI-Key", GEO_KEY as string);
    headers.append("X-RapidAPI-Host", "wft-geo-db.p.rapidapi.com");
    try{
        const res: Response = await fetch((geoUrl + `/cities/${idForWikiData}`), {
            method: "GET",
            headers
        });
    return await res.json();
    } catch(e) {
        console.error("Error fetching data from GeoDB Cities", e);
        return {} as CityItemGeo;
    }
}

async function getWikipediaDescription(title: string): Promise<string> {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&titles=${encodeURIComponent(title)}`);
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId].extract ;
}

  
async function getWikiData(idsForWikiData: string): Promise<Array<CityItem>>  {
    const entityParams = new URLSearchParams({
        action: 'wbgetentities',
        ids: idsForWikiData,
        languages: 'en',
        format: 'json'
      });
    
      try {
        const wikiResponse = await fetch(`${wikiUrl}?${entityParams.toString()}`);
        const wikiData = await wikiResponse.json();
        const entities: any = Object.values(wikiData.entities);
    
        const getClaimValue = (claim: { [key: string]: any; } | undefined) => claim?.[0]?.mainsnak?.datavalue?.value;

        const result = await Promise.all(entities.map(async (entity: {
            id: string;
            labels: { en: { value: string } };
            descriptions: { en: { value: string } };
            claims: { 
                P17?: { [key: string]: any },
                P1082?: { [key: string]: any },
                P2046?: { [key: string]: any },
                P18?: { [key: string]: any },
                P625?: { [key: string]: any }
            };
        }) => {
            const detailedDescription = await getWikipediaDescription(entity.labels.en.value);
            const coordinates = getClaimValue(entity.claims.P625);
            return {
                id: entity.id,
                name: entity.labels.en.value,
                description: detailedDescription || entity.descriptions.en.value || 'No description available',
                country: null,
                population: parseInt(getClaimValue(entity.claims.P1082)),
                area: parseInt(getClaimValue(entity.claims.P2046)?.amount) || '',
                image: getClaimValue(entity.claims.P18) ? 'https://commons.wikimedia.org/wiki/Special:FilePath/' + getClaimValue(entity.claims.P18) : '',
                coordinates: {
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude
                }
            }
        }));
        return result;
    } catch (error) {
        console.error('Error fetching data from Wikidata:', error);
        return [];
    }
}

export async function getCities(requestSearchParams: { [key: string]: string } = {}): Promise<CityData<CityItem>>  {
    const searchParams = new URLSearchParams([...Object.entries(requestSearchParams)]);
    const limit = parseInt(searchParams?.get('limit') ?? '0');
    const offset = parseInt(searchParams?.get('offset') ?? '0');
    const sort = parseInt(searchParams?.get('sort') ?? '');

    const geoDataResponse = await getGeoDataCities(limit, offset, sort);
    const geoData = geoDataResponse.data;

    if (!geoData) return  {data: [], links: [], metadata: {currentOffset: 0, totalCount: 0}};
    
    const idsForWikiData = geoData.map((item: CityItemGeo) => item.wikiDataId).join('|');
    
    const geoCities = geoData.reduce((accu: Record<string, {
        country: string;
        label: string;
        latitude: number;
        longitude: number;
        population: number;
      }>, item: CityItemGeo) => {
            accu[item.wikiDataId] = {
                country: item.country,
                label: item.name,
                latitude: item.latitude,
                longitude: item.longitude,
                population: item.population
            }
            return accu
        }, {} );
    const wikiCities = await getWikiData(idsForWikiData);

    const result = wikiCities.map((entity: CityItem) => {
        const {
            id, 
            coordinates, 
            area, 
            description, 
            image, 
            name, 
            population
        } = entity;
        return {
            id,
            name,
            description: description || 'No description available',
            country: geoCities[entity.id]?.country || 'no data',
            population: population || geoCities[entity.id]?.population || 'no data',
            area,
            image,
            coordinates: {
                latitude: coordinates.latitude || geoCities[entity.id]?.latitude,
                longitude: coordinates.longitude || geoCities[entity.id]?.longitude,
            }
        }
    });
    return {
        data: result,
        links: geoDataResponse.links,
        metadata: geoDataResponse.metadata
    };
}


export async function getCity(idForWikiData: string): Promise<CityItem>  {
    const geoDataResponse = await getGeoDataCity(idForWikiData);
    console.log(geoDataResponse);
    const wikiCities = await getWikiData(idForWikiData);
    const {
        id, 
        coordinates, 
        area, 
        description, 
        image, 
        name, 
        population
    } = wikiCities[0];
    const result = {
            id,
            name,
            description: description || 'No description available',
            country: geoDataResponse.country || 'no data',
            population: population || geoDataResponse.population || 'no data',
            area,
            image,
            coordinates: {
                latitude: coordinates.latitude || geoDataResponse.latitude,
                longitude: coordinates.longitude || geoDataResponse.longitude,
            }
        }
    return result
}