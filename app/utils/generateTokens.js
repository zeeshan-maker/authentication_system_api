const jwt = require("jsonwebtoken");
require("dotenv").config();


const generateTokens = (user)=>{
    const accessToken = jwt.sign({
        user_id:user.user_id,
        role:user.role
    },
    process.env.JWT_SECRET,{expiresIn:"1m"}
    );

    const refreshToken = jwt.sign({
        user_id:user.user_id,
    },
    process.env.JWT_REFRESH_SECRET,{expiresIn:"7d"}
    );


    return { accessToken, refreshToken};
}


module.exports = generateTokens;