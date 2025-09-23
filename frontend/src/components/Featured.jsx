import React, { useEffect } from "react";
// import {dummyCarData} from "../assets/assets";
import { assets } from "../assets/assets";
import CarCard from "./CarCard";
import Title from "./Title";
import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";
import { useState } from "react";
import { motion } from "motion/react";

function Featured() {
  const { axios, navigate } = useAppContext();
  const [cars, setCars] = useState([]);

  const getCars = async () => {
    const { data } = await axios.get("/api/user/cars");

    if (data?.success) {
      setCars(data?.allCars);
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center py-24 px-6 md:px-16 1g:px-24 xl:px-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Title
          title="Featured Vehicles"
          subTitle="Explore our selection of premium vehicles available for your next adventure."
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18"
      >
        {cars.slice(0, 6).map((car) => (
          <motion.div 
          initial={{opacity: 0, scale: 0.95}}
    whileInView={{opacity: 1, scale: 1}}
    transition={{duration: 0.5, ease: "easeOut"}}

          key={car._id}>
            <CarCard car={car} />
          </motion.div>
        ))}
      </motion.div>
      <motion.button
      initial={{opacity: 0, y: 20}}
    whileInView={{opacity: 1, y: 0}}
    transition={{delay: 0.6  , duration: 0.5}}
        onClick={() => {
          navigate("/cars");
          scrollTo(0, 0);
        }}
        className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer"
      >
        Explore all cars <img src={assets.arrow_icon} alt="arrow" />
      </motion.button>
    </motion.div>
  );
}

export default Featured;
