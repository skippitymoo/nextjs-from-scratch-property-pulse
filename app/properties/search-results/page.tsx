"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import PropertySearchForm from "@/components/PropertySearchForm";
import Spinner from "@/components/Spinner";
import PropertyCard from "@/components/PropertyCard";
import { PropertyType } from "@/types/app-types";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);

  const location = searchParams.get("location");
  const propertyType = searchParams.get("propertyType");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await fetch(
          `/api/properties/search?location=${location}&propertyType=${propertyType}`,
          {
            method: "GET",
          }
        );

        if (res.status === 200) {
          const properties = (await res.json()) as PropertyType[];
          setProperties(properties);
        } else {
          setProperties([]);
          console.log(res.statusText);
          toast.warning("Failed to query properties");
        }
      } catch (error) {
        setProperties([]);
        console.error(error);
        toast.error("Failed to query properties");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [location, propertyType]);

  return (
    <>
      <section className="bg-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <PropertySearchForm
            initialLocation={location ?? ""}
            initialPropertyType={propertyType ?? ""}
          />
        </div>
      </section>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <section className="px-4 py-6">
          <div className="container-xl lg:container m-auto px-4 py-6">
            <Link
              href="/properties"
              className="flex items-center text-blue-500 hover:underline mb-3"
            >
              <FaArrowAltCircleLeft className="mr-2 mb-1" /> Back To Properties
            </Link>
            <h1 className="text-2xl mb-4">Search Results</h1>
            {properties.length === 0 ? (
              <p>No search results found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default SearchResultsPage;
