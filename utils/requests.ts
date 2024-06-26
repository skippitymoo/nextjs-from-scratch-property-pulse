import type { PropertyType } from "@/types/app-types";

const apiDomain = process.env.NEXT_PUBLIC_DOMAIN_API || null;

const fetchProperties = async (): Promise<PropertyType[]> => {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) return [];

    const res = await fetch(`${apiDomain}/properties`);

    if (!res.ok) {
      throw new Error("Failed to fetch properties data!!!");
    }

    return (await res.json()) as unknown as PropertyType[];
  } catch (error) {
    console.error("------ Properties fetch - ERROR ------", error);
  }

  return [];
};

const fetchProperty = async (id: string): Promise<PropertyType | null> => {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) return null;

    const res = await fetch(`${apiDomain}/properties/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch property data!!!");
    }

    return (await res.json()) as unknown as PropertyType;
  } catch (error) {
    console.error("------ Property fetch - ERROR ------", error);
  }

  return null;
};

export { fetchProperties, fetchProperty };
