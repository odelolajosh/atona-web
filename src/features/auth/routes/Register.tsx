import { Helmet } from "react-helmet-async";
import { RegisterForm } from "../components/register-form";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  return (
    <div className="mt-[min(15%,10rem)] p-4">
      <Helmet>
        <title>Create Account - Atona GCS</title>
      </Helmet>
      <RegisterForm onSuccess={() => navigate("/")} />
    </div>
  );
};