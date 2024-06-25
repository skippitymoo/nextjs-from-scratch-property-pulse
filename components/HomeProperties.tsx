import Link from "next/link";
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
    console.error("------ Home Properties fetch - ERROR ------", error);
  }

  return [];
};

const HomeProperties = async () => {
  const properties = await fetchProperties();
  const recentProperties = properties
    .sort(() => Math.random() - Math.random())
    .slice(0, 3);

  return (
    <>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
            Recent Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.length === 0 ? (
              <p>No properties found</p>
            ) : (
              recentProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>
      <section className="m-auto max-w-lg my-10 px-6">
        <Link
          href="/properties"
          className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
        >
          View All Properties
        </Link>
      </section>
    </>
  );
};

export default HomeProperties;
