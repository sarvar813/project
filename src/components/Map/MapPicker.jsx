import React, { useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import './MapPicker.css';

const MapPicker = ({ onSelect, onClose }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (!mapInstance.current && window.L) {
            // Toshkent markazi koordinatalari (Restoran joylashuvi)
            const restaurantPos = [41.311081, 69.240562];
            const defaultPos = [41.311081, 69.240562];

            mapInstance.current = window.L.map(mapRef.current).setView(defaultPos, 13);

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(mapInstance.current);

            // Markerni o'rtaga qo'yish
            markerRef.current = window.L.marker(defaultPos, { draggable: true }).addTo(mapInstance.current);

            // Marker surilganda manzilni olish (simulatsiya)
            markerRef.current.on('dragend', function (event) {
                const position = markerRef.current.getLatLng();
                console.log("New position:", position);
            });

            // Xaritaga bosilganda markerni o'sha yerga ko'chirish
            mapInstance.current.on('click', function (e) {
                markerRef.current.setLatLng(e.latlng);
                updateDistance(e.latlng);
            });

            markerRef.current.on('dragend', function (e) {
                updateDistance(e.target.getLatLng());
            });
        }

        const updateDistance = (pos) => {
            const restaurantPos = window.L.latLng(41.311081, 69.240562);
            const distance = restaurantPos.distanceTo(pos) / 1000; // km
            const fee = distance < 2 ? 0 : Math.ceil(distance / 2) * 1; // har 2km uchun $1

            const distEl = document.getElementById('map-distance-info');
            if (distEl) {
                distEl.innerHTML = `Masofa: <b>${distance.toFixed(1)} km</b> | Yetkazib berish: <b>${fee === 0 ? 'BEPUL' : '$' + fee.toFixed(2)}</b>`;
            }
        };

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    const handleConfirm = () => {
        const pos = markerRef.current.getLatLng();
        const restaurantPos = window.L.latLng(41.311081, 69.240562);
        const distance = restaurantPos.distanceTo(pos) / 1000;
        const fee = distance < 2 ? 0 : Math.ceil(distance / 2) * 1;

        const mockAddress = `Lokatsiya: ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)} (${distance.toFixed(1)} km)`;
        onSelect(mockAddress, fee);
        onClose();
    };

    return (
        <div className="map-picker-overlay" onClick={onClose}>
            <div className="map-picker-content" onClick={(e) => e.stopPropagation()}>
                <div className="map-header">
                    <h3>📍 {'Yetkazib berish manzilini tanlang'}</h3>
                    <button onClick={onClose}><FaTimes /></button>
                </div>
                <div id="leaflet-map" ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
                <div id="map-distance-info" className="map-distance-info">
                    Masofa: <b>0.0 km</b> | Yetkazib berish: <b>BEPUL</b>
                </div>
                <div className="map-footer">
                    <p className="map-hint">Xaritadagi belgini kerakli joyga suring yoki o'sha yerga bosing.</p>
                    <button className="confirm-loc-btn" onClick={handleConfirm}>
                        MANZILNI TASDIQLASH
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapPicker;
