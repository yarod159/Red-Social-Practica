const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

// el nombre del usuario debe ser único y es obligatorio
  name: {
    type: String,
    unique: true,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  profilePicture: {
    type: String,
  },
  joinDate: {
    type: Date,
    dafaul: Date.now,
  },
  //mongoose.Schema.Types.ObjectId
  //se utiliza para referenciar a otros documentos de usuario
  setFollowRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers:         [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
});

const User = mongoose.model("User", userSchema);

module.exports=User;