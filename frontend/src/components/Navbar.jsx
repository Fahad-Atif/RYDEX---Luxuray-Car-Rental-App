import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";
import { motion } from "motion/react"; // ✅ Correct import

function Navbar() {
  const { setShowLogin, user, isOwner, setIsOwner, axios, logout } = useAppContext();

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const changeRole = async () => {
  try {
    const { data } = await axios.post("/api/owner/change-role");

    if (data?.success) {
      toast.success(data?.message);
      setIsOwner(true);
      navigate("/owner"); // ✅ Navigate after role changes
    } else {
      toast.error("Please Login or Register First!");
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center justify-between bg-light text-gray-600 py-4 px-6 md:px-16 lg:px-24 xl:px-32 border-b relative transition-all border-borderColor"
    >
      <Link to="/">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="logo"
          className="h-8"
        />
      </Link>

      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16
    max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row
    items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all
    duration-300 z-50 max-sm:bg-white ${
      open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"
    }`}
      >
        {menuLinks.map((val, i) => (
          <div key={val.name || i}>
            <Link to={val.path}>{val.name}</Link>
          </div>
        ))}

        <div className="hidden lg:flex justify-end placeholder-gray-500 items-center border max-w-56 text-sm border-borderColor rounded-full px-3">
          <input
            className="w-full py-1.5 outline-none bg-transparent"
            type="text"
            placeholder="Search Cars"
          />
          <button type="button" className="cursor-pointer">
            <img src={assets.search_icon} alt="search" />
          </button>
        </div>

        <div className="flex max-sm:flex-col gap-6 items-start sm:items-center">
          <button
            type="button"
            onClick={() => {
              isOwner ? navigate("/owner") : changeRole();
            }}
            className="cursor-pointer"
          >
            {isOwner ? "Dashboard" : "List Cars"}
          </button>

          <button
  onClick={() => {
    if (user) {
      logout();
    } else {
      setShowLogin(true);
      setOpen(false); // ✅ Close mobile menu when login is triggered
    }
  }}
  className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull rounded-lg text-white"
>
  {user ? "Logout" : "Login"}
</button>
        </div>
      </div>

      <div onClick={() => setOpen(!open)} className="sm:hidden cursor-pointer">
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </div>
    </motion.div>
  );
}

export default Navbar; 
