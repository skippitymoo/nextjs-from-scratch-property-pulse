import type { GetPropertiesPayload } from "@/types/api-types";
import type { PropertyType } from "@/types/app-types";

const apiDomain = process.env.NEXT_PUBLIC_DOMAIN_API || null;

const fetchProperties = async (
  page: number,
  pageSize: number
): Promise<GetPropertiesPayload> => {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) return { total: 0, properties: [] };

    const res = await fetch(
      `${apiDomain}/properties?page=${page}&pageSize=${pageSize}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch properties data!!!");
    }

    const resJson = await res.json();

    return resJson;
  } catch (error) {
    console.error("------ Properties fetch - ERROR ------", error);
  }

  return { total: 0, properties: [] };
};

const fetchPropertiesFeatured = async (): Promise<PropertyType[]> => {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) return [];

    const res = await fetch(`${apiDomain}/properties/featured`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch featured properties data!!!");
    }

    const resJson = await res.json();

    return resJson;
  } catch (error) {
    console.error("------ Featured Properties fetch - ERROR ------", error);
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

    const resJson = await res.json();

    return resJson as PropertyType;
  } catch (error) {
    console.error("------ Property fetch - ERROR ------", error);
  }

  return null;
};

export { fetchProperties, fetchProperty, fetchPropertiesFeatured };
