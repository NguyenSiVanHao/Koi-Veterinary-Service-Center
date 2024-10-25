import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function Mapbox() {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiY29udHJhaWN1bmciLCJhIjoiY20ybHpyNjZuMGlqbjJsb3BuZXFybzBlbyJ9.i8VAYVfryAk22MkckCS9kA';
        
        if (map.current) return; // initialize map only once
        
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [105.7938072, 21.0244246], // [longitude, latitude]
            zoom: 16
        });

        // Clean up on unmount
        return () => map.current.remove();
    }, []);

    return <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />;
}

export default Mapbox;
