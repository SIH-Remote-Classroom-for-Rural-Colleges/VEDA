import mongoose from 'mongoose'

const DbConnect=async()=>{
    
    try {
        const connection=await mongoose.connect('mongodb+srv://nishithcbit_db_user:j3bnH0NdIPwNIrH4@cluster0.iuvocao.mongodb.net/VEDA?retryWrites=true&w=majority&appName=Cluster0')
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
    console.error("MongoDB connection error:", error);
    }
}
export default DbConnect