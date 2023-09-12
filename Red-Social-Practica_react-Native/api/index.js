const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb+srv://asdrubalyarod34:123@cluster0.gikrq8y.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => {
    console.log("Error al conectar a MongoDB:", err);
  });

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

const User = require("./models/user");
const Post = require("./models/post");


const sendVerificationEmail = async (email, verificationToken) => {
  // crear el nodemailer

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "asdrubalyarod34@gmail.com",
      pass: "ojdsrwqjhpocdzhh",
    },
  });

  //redactar el mensaje de correo  que le va llegar al usuario

  const mailOptions = {
    from: "FoodShare.com",
    to: email,
    subject: "Verificacion de correo electronico",
    text: `Por favor hacer click en el enlace para verificar su cuenta : http://localhost:8000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error al enviar el correo ", error);
  }
};


//enpoint para registrar usuarios  en el backend

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //existe el usuario?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: " correo electronico ya existe" });
    }

    // no existe el usuario

    const newUser = new User({ name, email, password });
    //generar y verificar token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //guardar el usuario en la base de datos
    await newUser.save();

    // enviar el correo electronico verificado

    sendVerificationEmail(newUser.email,newUser.verificationToken);

    res
      .status(200)
      .json({ message: "registro exitoso por favor revise su correo" });

  } catch (error) {
    console.log("error de registrar un usuario", error);
    res.status(500).json({ message: "error registrado en usuario" });
  }
});


app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Token invalido" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Correo electronico verificado" });
  } catch (error) {
    console.log("error al obtener el token", error);
    res.status(500).json({ message: "Verificacion por correo fallo" });
  }
});


const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "email no encontrado" });
    }

    if (user.password !== password) {
      return res.status(404).json({ message: "contraseña invalida" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "error de inicio de sesion" });
  }
});
