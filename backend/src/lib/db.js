import mongoose from 'mongoose'

const DbConnect=async()=>{
    
    try {
        const connection=await mongoose.connect('mongodb+srv://bharanikumar0502_db_user:WaL0dRLAcV51hOSQ@cluster0.9l7xetb.mongodb.net/')
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
    console.error("MongoDB connection error:", error);
    }
}
export default DbConnect