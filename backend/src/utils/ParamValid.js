const mongoose = require("mongoose")


function isGoalIdValid(goalId) {

    return mongoose.Types.ObjectId.isValid(goalId)
    
}

module.exports = { isGoalIdValid }