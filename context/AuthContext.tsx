import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FormEvent,
  use,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

interface AuthTokens {
  access: string;
  refresh: string;
}

interface User {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
}

interface AuthContextType {
  user: User | null;
  authTokens: AuthTokens | null;
  loginUser: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
    const access = Cookies.get("access_token");
    const refresh = Cookies.get("refresh_token");
    return access && refresh ? { access, refresh } : null;
  });

  const [user, setUser] = useState<User | null>(() => {
    const access = Cookies.get("access_token");
    return access ? jwtDecode<User>(access) : null;
  });

  const navigate = useNavigate();

  const loginUser = async (username: string, password: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username,
      password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    console.log(raw);

    const response = await fetch(
      "http://127.0.0.1:8000/users/login/",
      requestOptions
    );
    const data = await response.json();
    const user = JSON.stringify(data.user_data);
    if (response.status === 200) {
      const access = data.access.replace(/\s+/g, "");
      const refresh = data.refresh;

      localStorage.setItem("user", JSON.stringify(data.user));

      // Store tokens in cookies
      Cookies.set("access_token", access, { secure: true, sameSite: "Strict" });
      Cookies.set("refresh_token", refresh, {
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("user", JSON.stringify(data.user), {
        secure: true,
        sameSite: "Strict",
      });

      setAuthTokens({ access, refresh });
      setUser(jwtDecode<User>(access));
      navigate("/");
    } else {
      alert("Something went wrong!");
    }
  };

  const contextData: AuthContextType = {
    user,
    authTokens,
    loginUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
