import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets, cityList } from "../assets/assets";
import { motion } from "motion/react";
function HeroSection() {
  const { returnDate, pickupDate, setReturnDate, setPickupDate, navigate } =
    useAppContext();

  const [pickupLocation, setPickupLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(
      `/cars?city=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen flex flex-col items-center justify-center gap-14
    bg-light text-center"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5}}
        className="text-4xl md:text-5xl font-semibold"
      >
        Luxury cars on Rent
      </motion.h1>
      <motion.form
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-center md:items-center justify-between 
      p-6 rounded-1g max-sm:rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white 
      shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8">
          <div className="flex flex-col gap-4 items-start">
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
            >
              <option value="">Select City</option>
              {cityList.map((city) => (
                <option value={city} key={city}>
                  {city}
                </option>
              ))}
            </select>

            <p className="px-1 text-sm text-gray-500">
              {pickupLocation ? pickupLocation : "Please Select Location"}
            </p>
          </div>
          <div className="flex flex-col gap-4 items-start">
            <label htmlFor="pickup-date">PickUp Date</label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="flex flex-col gap-4 items-start">
            <label htmlFor="return-date">Return Date</label>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              id="return-date"
            />
          </div>
        </div>
        <button
          className="flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full
cursor-pointer"
        >
          <img
            src={assets.search_icon}
            alt="Search"
            className="brightness-300"
          />
          Search
        </button>
      </motion.form>
      <motion.img
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        src={assets.main_car}
        alt="car"
        className="max-h-74"
      />
    </motion.div>
  );
}

export default HeroSection;
