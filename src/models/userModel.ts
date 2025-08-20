import * as dynamoose from "dynamoose";

const userSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: {
      name: "emailIndex",
      type: "global"
    },
  },
  password: {
    type: String,
    required: false, // Optional for OAuth users
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  provider: {
    type: String,
    required: true,
    enum: ["email", "google"],
  },
  googleId: {
    type: String,
    required: false,
    index: {
      name: "googleIdIndex",
      type: "global",
    },
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

const User = dynamoose.model("Users", userSchema);

export default User;
