import Bookings from "../models/Booking.js";
import Car from "../models/Owner.js";

// Function to check car availability in the given time span
const checkAvailability = async (carId, pickupDate, returnDate) => {
  try {
    const requestedStart = new Date(pickupDate);
    const requestedEnd = new Date(returnDate);

    const overlappingBookings = await Bookings.find({
      car: carId,
      $or: [
        {
          pickupDate: { $lte: requestedEnd },
          returnDate: { $gte: requestedStart },
        },
      ],
    });

    return overlappingBookings.length === 0;
  } catch (error) {
    throw new Error("Error checking availability: " + error.message);
  }
};

// API to get available cars based on location and timing
export const giveAvailableCars = async (req, res) => {
  const { location, pickupDate, returnDate } = req.body;

  const cars = await Car.find({ location, isAvailable: true });

  const carAvailable = cars.map(async (car) => {
    const available = await checkAvailability(car._id, pickupDate, returnDate);
    return { ...car._doc, isAvailable: available };
  });

  const allAvailableCars = await Promise.all(carAvailable);

  const availableCars = allAvailableCars.filter(
    (car) => car.isAvailable === true
  );

  res.json({
    message: "Available Cars",
    success: true,
    allFilteredCars : availableCars,
  });
};

// API to create bookings
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    const carAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!carAvailable) {
      return res.json({
        message: "Car is not available for booking. Check for other cars!",
      });
    }

    const carData = await Car.findById(car);

    // Calculate cost of renting
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = carData.pricePerDay * noOfDays;

    const newBooking = await Bookings.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
    });

    res.json({
      message: "Booking Done!",
      success: true,
      newBooking,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// API to fetch user bookings
export const getMyBookings = async (req, res) => {
  try {
    const { _id } = req.user;

    const mybookings = await Bookings.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "My Bookings Fetch",
      bookings: mybookings, // Include bookings data
    });
  } catch (error) {
    res.json({
      message: error.message, // Correct typo
    });
  }
};

// API to fetch owner bookings
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({
        message: "unAuthorize Access!",
      });
    }

    const bookings = await Bookings.find({ owner: req.user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Owner's Bookings Fetch",
      bookings,
    });
  } catch (error) {
    res.json({
      message: error.message, // Correct typo
    });
  }
};

// API for changing booking status
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    const findBooking = await Bookings.findById(bookingId);
    if (!findBooking) {
      return res.json({
        message: "Booking not found!",
      });
    }

    if (findBooking.owner.toString() !== _id.toString()) {
      return res.json({
        message: "unAuthorize Access!",
      });
    }

    findBooking.status = status;
    await findBooking.save();

    res.json({
      message: "Status has been changed of Booking",
      success: true,
      changedStatus: status,
    });
  } catch (error) {
    res.json({
      message: error.message, // Correct typo
    });
  }
};
