"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { PropertyType } from "@/types/app-types";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";

const SavedPropertiesPage = () => {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProperites = async () => {
      try {
        const res = await fetch(`/api/bookmarks`, {
          method: "GET",
        });

        if (res.status === 200) {
          const properties = (await res.json()) as PropertyType[];
          setProperties(properties);
        } else {
          console.log(res.statusText);
          toast.warning("Failed to fetch saved properties");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch saved properties");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperites();
  }, []);

  if (loading) return <Spinner loading={true} />;

  return (
    !loading && (
      <section className="px-4 py-6">
        <h1 className="text-xl mb-4">Saved Properties</h1>
        <div className="container-xl lg:container m-auto px-4 py-6">
          {properties.length === 0 ? (
            <p>No properties found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    )
  );
};

export default SavedPropertiesPage;
