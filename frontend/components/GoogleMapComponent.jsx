import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

const containerStyle = { width: "100%", height: "420px" };

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    { featureType: "poi.school", elementType: "labels", stylers: [{ visibility: "on" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#e3f2fd" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f8f9fc" }] },
  ],
};

const GoogleMapComponent = ({ institutes, userLocation }) => {
  const [selected, setSelected] = useState(null);
  const [mapType, setMapType] = useState("roadmap");
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const onLoad = useCallback((map) => { mapRef.current = map; }, []);

  const fitBounds = () => {
    if (!mapRef.current || institutes.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    if (userLocation) bounds.extend(userLocation);
    institutes.forEach((inst) => {
      if (inst.location?.coordinates?.length === 2) {
        bounds.extend({ lat: inst.location.coordinates[1], lng: inst.location.coordinates[0] });
      }
    });
    mapRef.current.fitBounds(bounds, { padding: 60 });
  };

  if (loadError) {
    return (
      <div className="w-full h-[420px] bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-500 border border-gray-200">
        <span className="text-3xl mb-2">🗺️</span>
        <p className="text-sm font-medium">Map unavailable</p>
        <p className="text-xs text-gray-400 mt-1">Check your Google Maps API key</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[420px] bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          <span className="text-sm">Loading map...</span>
        </div>
      </div>
    );
  }

  const defaultCenter = userLocation || { lat: 28.5355, lng: 77.391 };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-200">
      {/* Map controls overlay */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <button
          onClick={fitBounds}
          title="Fit all markers"
          className="bg-white shadow-md rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition border border-gray-200"
        >
          ⊡ Fit All
        </button>
        <select
          value={mapType}
          onChange={(e) => setMapType(e.target.value)}
          className="bg-white shadow-md rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-700 border border-gray-200 focus:outline-none"
        >
          <option value="roadmap">Road</option>
          <option value="satellite">Satellite</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      {/* Legend */}
      <div className="absolute bottom-10 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-md px-3 py-2 text-xs border border-gray-200">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Your location
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Institute
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={userLocation ? 13 : 11}
        options={{ ...mapOptions, mapTypeId: mapType }}
        onLoad={onLoad}
        onClick={() => setSelected(null)}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#3b82f6",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 3,
            }}
            title="Your Location"
            zIndex={100}
          />
        )}

        {/* Institute markers */}
        {institutes.map((inst) => {
          if (!inst.location?.coordinates?.length) return null;
          return (
            <Marker
              key={inst._id}
              position={{
                lat: inst.location.coordinates[1],
                lng: inst.location.coordinates[0],
              }}
              onClick={() => setSelected(inst)}
              title={inst.name}
              animation={selected?._id === inst._id ? window.google.maps.Animation.BOUNCE : undefined}
            />
          );
        })}

        {/* InfoWindow */}
        {selected && selected.location?.coordinates && (
          <InfoWindow
            position={{
              lat: selected.location.coordinates[1],
              lng: selected.location.coordinates[0],
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div className="p-1 max-w-[220px]">
              {selected.image && (
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                  onError={(e) => e.target.remove()}
                />
              )}
              <p className="font-bold text-sm text-gray-900">{selected.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{selected.city}{selected.state ? `, ${selected.state}` : ""}</p>
              {selected.category && (
                <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full mt-1 font-medium">
                  {selected.category}
                </span>
              )}
              {selected.rating > 0 && (
                <p className="text-xs text-amber-500 font-semibold mt-1">
                  {"★".repeat(Math.round(selected.rating))} {selected.rating}/5
                </p>
              )}
              {selected.fees && (
                <p className="text-xs text-indigo-700 font-bold mt-1">
                  ₹{selected.fees.toLocaleString("en-IN")}/yr
                </p>
              )}
              {selected.distanceInKm && (
                <p className="text-xs text-emerald-600 font-medium mt-1">📍 {selected.distanceInKm} km away</p>
              )}
              <button
                onClick={() => navigate(`/institutes/${selected._id}`)}
                className="mt-2.5 w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-semibold transition"
              >
                View Details →
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
