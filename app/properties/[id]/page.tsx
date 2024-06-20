"use client";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

const PropertyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const name = searchParams.get("name");
  const pathname = usePathname();

  return (
    <div>
      <h1 className="text-3xl">
        Property Page - {name} - {pathname}
      </h1>
      <button onClick={() => router.push("/")} className="bg-blue-500 p-2">
        Go Home {id} (client onclick)
      </button>
    </div>
  );
};

export default PropertyPage;
