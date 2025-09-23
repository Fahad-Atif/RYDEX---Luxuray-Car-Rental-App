import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { assets, dummyCarData } from "../../assets/assets";
import { useAppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";

function ManageCars() {
  const { axios, isOwner, currency } = useAppContext();

  const [cars, setCar] = useState([]);

  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/owner/cars");

      if (data?.success) {
        setCar(data.cars);
        // toast.success(data?.message);
      } else {
        toast.error(data?.message || "Failed to fetch cars");
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error("Something went wrong while fetching cars");
    }
  };

  const handleToggle = async (carId) => {
    try {
      const { data } = await axios.post("/api/owner/toggel-car", { carId });

      if (data?.success) {
        toast.success(data?.message);
        fetchCars();
      } else {
        toast.error(data?.message || "Failed to change Availabilty");
      }
    } catch (error) {
      toast.error(
        "Something went wrong while changing car availibility",
        error
      );
    }
  };
  

  const handleDelete = async (carId) => {
    // const permission = window.alert("Are you sure you want to remove this car")
    try {

      

      const { data } = await axios.post("/api/owner/delete-car", { carId });

      if (data?.success) {
        toast.success(data?.message);
        fetchCars();
      } else {
        toast.error(data?.message || "Failed to change Availabilty");
      }
    } catch (error) {
      toast.error(
        "Something went wrong while changing car availibility",
        error
      );
    }
  };
  

  useEffect(() => {
    isOwner && fetchCars();
  }, [isOwner]);

  return (
    <div className="pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subtitle="View all listed cars, update their details, or remove them from the booking platform."
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={car.id || index} className="border-t border-borderColor">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="h-12 w-12 aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-sm text-gray-500">
                      {car.seating_capacity} - {car.transmission}
                    </p>
                  </div>
                </td>

                <td className="p-3 max-md:hidden">{car.category}</td>
                <td className="p-3">${car.pricePerDay}/day</td>
                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      car.isAvailable
                        ? "bg-green-100 text-green-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {car.isAvailable ? "Available" : "unAvailable"}
                  </span>
                </td>
                <td className="flex items-center p-3 gap-3">
                  <img
                    onClick={() => {
                      handleToggle(car._id);
                    }}
                    src={
                      car.isAvailable ? assets.eye_close_icon : assets.eye_icon
                    }
                    alt={car.isAvailable ? "Hide car" : "Show car"}
                    className="cursor-pointer"
                  />
                  <img onClick={()=>{
                    handleDelete(car._id)
                  }}
                    src={assets.delete_icon}
                    alt="Delete car"
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageCars;
