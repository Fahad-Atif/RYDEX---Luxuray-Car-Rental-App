import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; // ✅ FIXED: correct import from framer-motion

function Cars() {
  const [input, setInput] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);

  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();

  const isSearchData = pickupLocation && pickupDate && returnDate;

  // ✅ Filter cars based on search input
  const filterCars = () => {
    if (!input.trim()) {
      setFilteredCars(cars);
    } else {
      const lowerInput = input.toLowerCase();
      const filtered = cars.filter((car) =>
        [car.model, car.brand, car.category, car.transmission].some((field) =>
          field?.toLowerCase().includes(lowerInput)
        )
      );
      setFilteredCars(filtered);
    }
  };

  // ✅ Get available cars from backend if search data is present
  const carAvailability = async () => {
    try {
      const { data } = await axios.get(`/api/booking/check-availablity`, {
        params: {
          location: pickupLocation,
          pickupDate,
          returnDate,
        },
      });

      if (data?.success) {
        setFilteredCars(data.allFilteredCars);
        if (data.allFilteredCars.length === 0) {
          toast.error("No cars available for the selected criteria");
        }
      } else {
        toast.error("Failed to fetch available cars");
      }
    } catch (error) {
      console.error("Error checking car availability:", error);
      toast.error("Something went wrong while checking availability.");
    }
  };

  // ✅ Input filtering only when there's no date/location-based search
  useEffect(() => {
    if (cars?.length > 0 && !isSearchData) {
      filterCars();
    }
  }, [input, cars, isSearchData]);

  // ✅ Check availability on mount if search data exists
  useEffect(() => {
    if (isSearchData) {
      carAvailability();
    } else {
      setFilteredCars(cars); // ✅ fallback if no search data
    }
  }, [isSearchData, cars]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center py-20 bg-light max-md:px-4"
      >
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />

        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img
            src={assets.search_icon}
            alt="Search"
            className="w-4.5 h-4.5 mr-2"
          />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500"
          />
          <img
            src={assets.filter_icon}
            alt="Filter"
            className="w-4.5 h-4.5 ml-2"
          />
        </div>
      </motion.div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars?.length} Cars
        </p>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4
            xl:px-20 max-w-7xl mx-auto"
        >
          {filteredCars?.map((car, index) => (
            <motion.div
              key={car._id || index} // ✅ Prefer using car._id as key
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cars;
