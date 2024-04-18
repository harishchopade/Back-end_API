const registerUser = async (req, res) => {
    try {
  
      const { fullName,email, password } = req.body;
      const userExits = await User.findOne({ email });
  
      if (userExits) {
        res.status(400).json({ msg: "Email already exist" });
        console.log("User Already exist");
        return;
      }
  
      // Creating a new user//
      const data = await User.create({ fullName,email,password });
  
      // Generating a new otp//
      const otp = await data.registerOTP()
      console.log(otp);
  
      // Storing the otp and email in cookie
      res.cookie('otp', otp, { maxAge: 900000, httpOnly: true });
      res.cookie('userEmail', email, { maxAge: 900000, httpOnly: true });//
  
      // generating token and then send the reponse //
      res.status(201).json({
        msg: "User Created Succesfully & OTP sent to your registred email address",
        token: await data.generateToken(),
        userId: data._id.toString(),
      });
  
    } catch (error) {
      console.log(error, "Internal Server Error");
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  };