import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function CarDetails() {
  const location = useLocation();
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    cars,
    axios,
    setReturnDate,
    returnDate,
    setPickupDate,
    pickupDate,
    currency,
    navigate,
  } = useAppContext();

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/booking/create", {
        car: id,
        pickupDate,
        returnDate,
      });

      if (data?.success) {
        navigate("/my-bookings");
        toast.success(data.message);
      } else {
        toast.error(data.message || "Booking failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Booking failed. Please try again.");
    }
  };

  // Scroll to top on location change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const fetchCarById = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/cars/${id}`);
        if (data.success) {
          setCar(data.car);
        } else {
          toast.error("Car not found.");
          setCar(null);
        }
      } catch (error) {
        toast.error("Failed to fetch car details.");
        setCar(null);
      }
      setLoading(false);
    };

    if (cars.length > 0) {
      const foundCar = cars.find((car) => car._id === id);
      if (foundCar) {
        setCar(foundCar);
        setLoading(false);
      } else {
        fetchCarById();
      }
    } else {
      // If cars list empty, fetch from backend
      fetchCarById();
    }
  }, [id, cars, axios]);

  if (loading) return <Loader />;

  if (!car)
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-center text-gray-500">
        <p>Car not found.</p>
      </div>
    );

  return (
    <motion.div
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
        whileHover={{ scale: 1.02 }}
      >
        <img
          src={assets.arrow_icon}
          className="rotate-180 opacity-65"
          alt="back_icon"
        />
        get back to all cars
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left: Car Image & Details */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md"
          />
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg">
                {car.category} {car.year}
              </p>
            </div>

            <hr className="border-borderColor my-6" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: assets.users_icon,
                  text: `${car.seating_capacity} Seats`,
                },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <motion.div
                  key={text}
                  className="flex flex-col items-center bg-light p-4 rounded-lg"
                  whileHover={{ scale: 1.03 }}
                >
                  <img src={icon} alt="" className="h-5 mb-2" />
                  {text}
                </motion.div>
              ))}
            </div>

            <div>
              <h1 className="text-xl font-medium mb-3">Description</h1>
              <p className="text-gray-500">{car.description}</p>
            </div>

            <div>
              <h1 className="text-xl font-medium mb-3">Features</h1>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "360 Camera",
                  "Bluetooth",
                  "GPS",
                  "Heated Seats",
                  "Rear View Mirror",
                ].map((item) => (
                  <li key={item} className="flex items-center text-gray-500">
                    <img src={assets.check_icon} className="h-4 mr-2" alt="" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Right: Booking Form */}
        <motion.form
          onSubmit={handleBooking}
          className="shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">
            {currency}
            {car.pricePerDay.toLocaleString()}
            <span className="text-base text-gray-400 font-normal">
              &nbsp;per day
            </span>
          </p>
          <hr className="border-borderColor my-6" />
          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date">Pickup Date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
            />

            <label htmlFor="return-date">Return Date</label>
            <input
              type="date"
              min={pickupDate}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
              id="return-date"
            />
          </div>

          <button className="w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer">
            Book Now
          </button>
          <p className="text-center text-sm">
            No credit card required to reserve
          </p>
        </motion.form>
      </div>
    </motion.div>
  );
}

export default CarDetails;
