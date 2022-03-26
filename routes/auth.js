const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.send("Auth Route")
})

//REGISTER
// router.post("/register", async (req, res) => {
//   try {
//     //generate new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);

//     //create new user
//     const newUser = new User({
//       username: req.body.username,
//       email: req.body.email,
//       password: hashedPassword,
//     });

//     //save user and respond
//     const user = await newUser.save();
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json(err)
//   }
// });

router.post('/', async (req, res) => {

  const{ username, email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt)

     const user = new User({
         username,
         email,
         password: hashedPassword,
          
     })
  try {
 const newUser = await user.save()
 res.status(201).json(newUser);

 try{
   const access_token = jwt.sign(
     JSON.stringify(newUser),
     process.env.SECRET_TOKEN
   );
 } catch (err){
   res.status(500).json({ message: error.message });
 }
     } catch (err) {
         res.status(400).json({ message:err.message})
     }
})

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});



module.exports = router;
