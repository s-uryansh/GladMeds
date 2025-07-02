'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const HospitalMap = dynamic(() => import('@/lib/hospitalMaps/hospitalMap'), { ssr: false });
const CPRAnimation = dynamic(() => import('@/lib/animations/CPRAnimation'), { ssr: false });
const RecoveryPosition = dynamic(() => import('@/lib/animations/RecoveryPosition'), { ssr: false });

export default function SOSPage() {
  const [hospitals, setHospitals] = useState([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.address) {
          setAddress(data.address);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (address) {
      fetch(`/api/geocode-address?address=${encodeURIComponent(address)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.lat && data.lng) {
            setLocation({ lat: data.lat, lng: data.lng });
          }
        })
        .catch(console.error);
    }
  }, [address]);

  useEffect(() => {
    if (location) {
      fetch(`/api/nearby-hospitals?lat=${location.lat}&lng=${location.lng}`)
        .then((res) => res.json())
        .then(setHospitals)
        .catch(console.error);
    }
  }, [location]);

return (
  <div className="bg-body-bg min-h-screen pt-32 pb-16 px-4 text-lightpurple"> 
    <div className="max-w-3xl mx-auto space-y-12">
      <h1 className="text-white text-4xl sm:text-5xl font-bold text-center">Emergency SOS</h1>

      <section className="border border-border rounded-xl p-6 bg-tablebg">
        <h2 className="text-lightsky text-2xl font-semibold mb-2">Registered Address</h2>
        {address ? (
          <p className="text-green-400">{address}</p>
        ) : (
          <p className="text-red-400">No address found.</p>
        )}
      </section>

      <section className="border border-border rounded-xl p-6 bg-tablebg">
        <h2 className="text-lightsky text-2xl font-semibold mb-4">Nearby Hospitals</h2>
        {hospitals.length > 0 ? (
          <ul className="space-y-3 mb-4">
            {hospitals.map((hospital: any) => (
              <li key={hospital.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{hospital.name}</span>
                  {hospital.distance && (
                    <span className="text-xs text-gray-400 ml-2">
                      (~{(hospital.distance / 1000).toFixed(1)} km)
                    </span>
                  )}
                </div>
                {hospital.phone ? (
                  <a
                    href={`tel:${hospital.phone}`}
                    className="flex items-center text-blue-400 underline text-sm space-x-1"
                  >
                    <span>📞</span>
                    <span>{hospital.phone}</span>
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(hospital.name + ' hospital')}`}
                    className="text-blue-400 text-sm"
                    target="_blank"
                  >
                    🔍 Search
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-red-400">No hospitals found nearby.</p>
        )}

        {location && hospitals.length > 0 && (
          <HospitalMap hospitals={hospitals} userLocation={location} />
        )}
      </section>

      <section className="border border-border rounded-xl p-6 bg-tablebg space-y-6">
        <h2 className="text-lightsky text-2xl font-semibold">First Aid Tips</h2>
        <CPRAnimation />
        <RecoveryPosition />
        <div>
          <h3 className="font-semibold text-lightblue text-lg mb-2">Recognizing Heart Attack/Stroke</h3>
          <ul className="list-disc ml-5 text-sm space-y-1">
            <li>Chest discomfort or pain</li>
            <li>Sudden weakness or numbness (especially on one side)</li>
            <li>Difficulty speaking or understanding</li>
            <li>Loss of balance or coordination</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
);

}
