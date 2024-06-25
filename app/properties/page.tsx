import PropertyCard from "@/components/PropertyCard";
import type { PropertyType } from "@/types/app-types";

const fetchProperties = async (): Promise<PropertyType[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_API}/properties`);

    if (!res.ok) {
      throw new Error("Failed to fetch properties data!!!");
    }

    return (await res.json()) as unknown as PropertyType[];
  } catch (error) {
    console.error("------ Properties fetch - ERROR ------", error);
  }

  return [];
};

export const PropertiesPage = async () => {
  const properties = await fetchProperties();

  properties.sort(
    (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
  );

  return (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {properties.length === 0 ? (
          <p>No properties found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertiesPage;
