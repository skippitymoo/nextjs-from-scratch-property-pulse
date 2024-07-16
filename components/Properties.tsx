"use client";
import { useEffect, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import Pagination from "@/components/Pagination";
import { fetchProperties } from "@/utils/requests";
import { PropertyType } from "@/types/app-types";
import Spinner from "./Spinner";

const Properties = () => {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const getProperties = async () => {
      try {
        const { total, properties } = await fetchProperties(page, pageSize);

        properties.sort(
          (a, b) =>
            new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
        );

        setTotalItems(total);
        setProperties(properties);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getProperties();
  }, [page, pageSize]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="px-4 py-6">
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
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default Properties;
