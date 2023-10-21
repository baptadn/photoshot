import LoginPage from "@/components/pages/LoginPage";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "next/navigation";

const Login = async () => {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LoginPage />;
};

export default Login;
