import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FormEvent,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Define the structure of the AuthTokens
interface AuthTokens {
  access: string;
  refresh: string;
}

// Define the structure of the User (as per your JWT payload)
interface User {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
}

// Define the structure of the AuthContext
interface AuthContextType {
  user: User | null;
  authTokens: AuthTokens | null;
  loginUser: (username: string, password: string) => Promise<void>; // Updated type
}

// Create the AuthContext with default `null` values
const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;

// Define props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")!)
      : null
  );

  const [user, setUser] = useState<User | null>(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode<User>(localStorage.getItem("authTokens")!)
      : null
  );

  const navigate = useNavigate();

  // Function to log in a user
  const loginUser = async (username: string, password: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: username,
      password: password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch(
      "http://127.0.0.1:8000/users/login/",
      requestOptions
    );
    const data = await response.json();

    if (response.status === 200) {
      console.log(data);
      const st = data.access_token.replace(/\s+/g, "");
      console.log(st);
      setAuthTokens(st);
      setUser(jwtDecode<User>(st));
      console.log(user); 
      localStorage.setItem(
        "authTokens",
        JSON.stringify({
          access: data.access_token,
          refresh: data.refresh_token,
        })
      );
      localStorage.setItem(
        "user",
        JSON.stringify(data.user_data)
      );
      navigate("/");
    } else {
      alert("Something went wrong!");
    }
  };

  // Context data to be passed
  const contextData: AuthContextType = {
    user,
    authTokens,
    loginUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
