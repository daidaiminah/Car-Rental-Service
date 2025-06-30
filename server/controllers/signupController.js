import db from "../models/index.js";


export const signupController = (req, res) => {
    const { name, email, password } = req.body;

    db.User.create({
        name,
        email,
        password
    })
    .then(() => {
        res.send("You have signed up successfully DUDE!");
    })
    .catch((err) => {
        console.log(err);
        console.log("There was an error while signing up DUDE!")
    })

};

export const getUserData = (req, res) => {
    db.User.findAll()
      .then((users) => {
        console.log(users); // This will print the data as Sequelize instances
        res.json(users);     // ✅ Send the actual user data as JSON
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("There was an error while getting user data DUDE!");
      });
  };
