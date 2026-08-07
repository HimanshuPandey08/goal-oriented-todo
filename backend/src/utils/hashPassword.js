const bcrypt = require("bcryptjs");


async function encypt(password) {
    
    return await bcrypt.hash(password,10) 
}

module.exports = encypt