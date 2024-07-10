"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Map, { Marker } from "react-map-gl";
import { setDefaults, fromAddress, OutputFormat } from "react-geocode";
import Spinner from "./Spinner";
import { PropertyType } from "@/types/app-types";
import pin from "@/assets/images/pin.svg";

import "mapbox-gl/dist/mapbox-gl.css";

interface PropertyMapProps {
  property: PropertyType;
}

const PropertyMap = ({ property }: PropertyMapProps) => {
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();
  const [viewport, setViewPort] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: "100%",
    height: "500px",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [geocodeError, setGeocodeError] = useState(false);

  // Set default response language and region (optional).
  // This sets default values for language and region for geocoding requests.
  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
    language: "en",
    region: "gb",
    outputFormat: OutputFormat.JSON,
  });

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fromAddress(
          `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
        );

        // check for result
        if (!res?.results.length) {
          // No result found
          setGeocodeError(true);
        }

        const { lat, lng } = res?.results[0]?.geometry.location;

        setLat(lat);
        setLng(lng);
        setViewPort({
          ...viewport,
          latitude: lat,
          longitude: lng,
        });
      } catch (error) {
        console.error(error);
        setGeocodeError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoords();
  }, []);

  if (loading) return <Spinner loading={loading} />;

  // handle case where geocoding failed
  if (geocodeError)
    return <div className="text-xl">No location data found</div>;

  return (
    !loading && (
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapLib={import("mapbox-gl") as any}
        initialViewState={{
          latitude: lat,
          longitude: lng,
          zoom: 15,
        }}
        style={{ width: "100%", height: 500 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker latitude={lat} longitude={lng} anchor="bottom">
          <Image src={pin} alt="location" width={40} height={40} />
        </Marker>
      </Map>
    )
  );
};

export default PropertyMap;
