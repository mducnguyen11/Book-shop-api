import mongoose  from "mongoose";

mongoose.set('strictQuery', true)
const conectDatabase = async () =>{
    try {
       const conection = await mongoose.connect(process.env.DB_URL,{
        useUnifiedTopology: true,
        useNewUrlParser: true
       })
       console.log("Database connected")
    } catch (error) { 
        process.exit(1)
    }
}

export default conectDatabase