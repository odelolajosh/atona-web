import { Helmet } from "react-helmet-async";
import { RegisterForm } from "../components/register-form";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Create Account - Atona GCS</title>
      </Helmet>
      <RegisterForm onSuccess={() => navigate("/")} />
    </>
  );
};