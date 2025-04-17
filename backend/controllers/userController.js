import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import validator from 'validator';

const registerUser = async (req, res) => {
  try {
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({message: "Please fill all the fields"});
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({message: "Please enter a valid email"});
    }

    if (password.length < 6) {
      return res.status(400).json({message: "Password must be at least 6 characters"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const userInfo = {
      username,
      email,
      password: hashedPassword,
    };

    const newUser = new User(userInfo)
    const user = await newUser.save();

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
    res.json({success: true, token})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email})

    if (!user) {
      return res.status(400).json({message: "User not found"});
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch){
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = user._doc;
      res.json({success: true, token, rest})
    } else {
      return res.status(400).json({message: "Invalid credentials"});
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

export { registerUser, loginUser };