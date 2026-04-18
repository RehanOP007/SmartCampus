import { useEffect } from "react";
import api from "../utils/axiosInstance";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDefaultRoute } from "../routes/getDefaultRoutes";

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
  const token = params.get("token");
  const role = params.get("role");

  if (token) {

    // set token FIRST so axios can use it
    localStorage.setItem("token", token);

    // OPTIONAL: if your axiosInstance doesn't already do this
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // CALL /me to get user details
    api.get("/api/auth/me")
      .then((res) => {

        const user = res.data;

        const authData = {
          token,
          role: user.role || role || "USER",
          userId: user.id,
          username: user.username,
          email: user.email,
        };

        // store full auth
        localStorage.setItem("auth", JSON.stringify(authData));
        setAuth(authData);

        // redirect immediately (no need 3 sec delay)
        navigate(getDefaultRoute(authData.role), { replace: true });

      })
      .catch(() => {
        // fallback (if /me fails)
        const authData = { token, role: role || "USER" };
        setAuth(authData);
        navigate(getDefaultRoute(authData.role), { replace: true });
      });
  }
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0E47] px-4">
      <div className="bg-[#272757] border border-[#505081] rounded-2xl p-12 text-center w-full max-w-sm">

        {/* Spinner */}
        <div className="w-10 h-10 border-2 border-[#505081] border-t-[#8686AC] rounded-full animate-spin mx-auto mb-5" />

        <p className="text-white font-medium text-lg mb-1">Signing you in</p>
        <p className="text-[#8686AC] text-sm">Completing Google authentication…</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;