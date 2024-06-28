"use client";
import Spinner from "@/components/Spinner";

const LoadingPage = ({ loading }: { loading: boolean }) => {
  return <Spinner loading={loading} />;
};

export default LoadingPage;
