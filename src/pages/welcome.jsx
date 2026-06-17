import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import logo from "../assets/Logo 1.png";

function Welcome() {
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <img src={logo} alt="NBIS Logo" className="w-[194px] h-[180px] object-contain mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Welcome to NBIS</h1>
      <p className="text-center mb-10 text-gray-500 text-sm">Newborn Biometric Identification System</p>
      <div className="w-full max-w-md space-y-4">
        <button onClick={() => navigate("/login")}
          className="w-full bg-[#1E88E5] text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition">
          Log in
        </button>
        <button onClick={() => navigate("/register")}
          className="w-full bg-[#43A047] text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition">
          Register
        </button>
      </div>
    </AuthLayout>
  );
}

export default Welcome;