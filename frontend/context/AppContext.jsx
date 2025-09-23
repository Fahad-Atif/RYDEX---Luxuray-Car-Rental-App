import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Create context
export const AppContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// Context provider
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // fetching the login User Data
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");

      if (data?.success) {
        setUser(data?.user);
        setIsOwner(data?.user?.role === "owner");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // logout User

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(null);
    axios.defaults.headers.common["Authorization"] = "";
    toast.success("You have logout");
  };

  // function for fetch all cars

  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      data?.success ? setCars(data.allCars) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // get token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    fetchCars();
  }, []);

  // setting token into Authorization headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `${token}`;
      fetchUser();
    }
  }, [token]);

  const value = {
    navigate,
    currency,
    axios,
    token,
    setToken,
    user,
    setUser,
    isOwner,
    setIsOwner,
    fetchCars,
    showLogin,
    setShowLogin,
    logout,
    fetchUser,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use context
export const useAppContext = () => {
  return useContext(AppContext);
};
