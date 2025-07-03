
import { Metadata } from "next";
import HeroSub from "@/components/shared/hero-sub";
import NotFound from "@/components/not-found";

export const metadata: Metadata = {
  title: "404 Page | Venus ",
};

const ErrorPage = () => {
  return (
    <>
      <HeroSub
        title="404"
      />
      <NotFound />
    </>
  );
};

export default ErrorPage;
