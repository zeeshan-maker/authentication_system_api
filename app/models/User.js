const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")


const User = sequelize.define("User",{
    user_id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    role:{
        type:DataTypes.STRING,
        defaultValue:"user",
    },
    isVerified:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    resetToken:{
        type:DataTypes.STRING
    },
    refreshToken:{
        type:DataTypes.STRING
    }
    
}
,
{
    tableName:"User",
    timestamps:true
});

module.exports = User;