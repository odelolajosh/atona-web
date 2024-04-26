import { Helmet } from "react-helmet-async";
import { LoginForm } from "../components/login-form";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Login - Atona GCS</title>
      </Helmet>
      <LoginForm onSuccess={() => navigate("/")} />
    </>
  );
};