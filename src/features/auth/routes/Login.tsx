import { Helmet } from "react-helmet-async";
import { LoginForm } from "../components/login-form";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="mt-[min(15%,10rem)] p-4">
      <Helmet>
        <title>Login - Atona GCS</title>
      </Helmet>
      <LoginForm onSuccess={() => navigate("/")} />
    </div>
  );
};