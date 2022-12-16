
// Using ES6 imports
import mongoose from 'mongoose';

const conectarDb = async () => {

    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,   
            useUnifiedTopology: true
        })

    } catch (error) {

        console.log(error)
        process.exit(1)

    }


}

export default conectarDb;