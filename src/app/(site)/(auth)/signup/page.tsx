import SignUp from "@/components/auth/sign-up";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Property",
};

const SignupPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sign Up Page" />
      <SignUp />
    </>
  );
};

export default SignupPage;
