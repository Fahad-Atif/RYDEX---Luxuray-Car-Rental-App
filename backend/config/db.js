import mongoose from "mongoose"

const connectDB = async() => {
    try {
        mongoose.connection.on("connected", ()=>{
            console.log("MongoDB is Connected Successfully!")
        })
        await mongoose.connect(`${process.env.MONGODB_URI}/rydex`)
    } catch (error) {
        console.log(error)
    }
}

export default connectDB;