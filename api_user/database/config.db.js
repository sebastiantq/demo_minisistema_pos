const mongoose = require('mongoose')


const dbConnection = async () => {

    try {
        
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
        })

        console.log('Base de datos online')

    } catch (error) {
        console.log(error)
        throw new Error('Error initialize DB');
    }

}

module.exports = {
    dbConnection
}