'use client'
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
  latitude: number;
  longitude: number;
  cityName: string;
};
export default function Map({ latitude, longitude, cityName }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.innerHTML = ''; // Очищаем содержимое контейнера карты
    }

    const map = L.map(mapRef.current!, {
      center: [latitude, longitude],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map)
      .bindPopup(cityName)
      .openPopup();

    // Сохраняем ссылку на экземпляр карты
    mapInstance.current = map;

    // Очищаем карту перед удалением компонента
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [latitude, longitude]);

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>;
};
