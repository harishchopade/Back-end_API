const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const userExists = await User.findOne({ email });
  
      if (!userExists) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
  
      if (await userExists.passwordChecker(password) && userExists.isVerified == true) {
        const token = await userExists.generateToken();
        res.status(200).json({
          msg: "Login Successfully",
          token,
          userId: userExists._id.toString()
        });
        console.log("Login Successfully");
      } else {
        if (userExists.isVerified==false) {
          res.status(403).json({ msg: "Verify the account and then try to login" })
        }
        else {
          res.status(401).json({ msg: "Invalid Credentials" });
        }
      }
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  };