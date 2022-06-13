import { NextPage } from "next";

const SignupSuccess: NextPage = () => (
  <main className="min-h-screen grid place-content-center">
    <div className="text-center">
      <h1 className="text-4xl text-teal-900 font-semibold mb-4">
        Sign Up Success!
      </h1>
      <p className="text-lg">
        Please check your email for a verification message!
      </p>
    </div>
  </main>
);

export default SignupSuccess;
