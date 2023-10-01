const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

//encriptar contraseña
const bcrypt = require("bcrypt");
const saltRounds = 10;
//
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
const Profile = require("./models/profile");

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "asdrubalyarod34@gmail.com",
      pass: "ojdsrwqjhpocdzhh",
    },
  });

  const mailOptions = {
    from: "FoodShare.com",
    to: email,
    subject: "Verificacion de correo electronico",
    text: `Por favor hacer click en el enlace para verificar su cuenta : http://localhost:8000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.log("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
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
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // no existe el usuario

    const newUser = new User({ name, email, password: hashedPassword });

    //generar y verificar token

    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //guardar el usuario en la base de datos
    await newUser.save();

    // enviar el correo electronico verificado

    sendVerificationEmail(newUser.email, newUser.verificationToken);

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

const verifyUser = (req, res, next) => {
  if (!req.user.verified) {
    return res.status(401).json({ message: "Usuario no verificado" });
  }
  next();
};

app.get("/protected-route", verifyUser, (req, res) => {
  // This route will only be accessible if the user is verified
  res.status(200).json({ message: "Acceso permitido" });
});

const secretKey = generateSecretKey();


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "email no encontrado" });
    }

    // Verificar la contraseña
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(404).json({ message: "contraseña invalida" });
    }

    if (!user.verified) {
      return res.status(401).json({ message: "Usuario no verificado" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "error de inicio de sesion" });
  }
});

//screen Favorite
//enpoint para acceder a todos los usuarios excepto lo que iniciaron sesión
// porque ese usuario no se puede seguir a si mismo

app.get("/user/:userId", (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    User.find({ _id: { $ne: loggedInUserId } })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        console.log("Error: ", error);
        res.status(500).json("Error");
      });
  } catch (error) {
    res.status(500).json({ message: " error al encontrar los usuarios" });
  }
});

//endpoint para seguir un usuario en particular

app.post("/follow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error a seguir una persona" });
  }
});

//endpoint para dejar de seguir un usuario en particular

app.post("/users/unfollow", async (req, res) => {
  const { loggedInUserId, targetUserId } = req.body;

  try {
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId },
    });

    res.status(200).json({ message: "dejar de seguir exitosamente " });
  } catch (error) {
    res.status(500).json({ message: "Error de seguir a un usuario" });
  }
});

//
//
// SCREEN POST
//
//

//endPoint crear una nueva publicacion
app.post("/create-post", async (req, res) => {
  try {
    const { content, userId } = req.body;
    const newPostData = {
      user: userId,
    };

    if (content) {
      newPostData.content = content;
    }

    const newPost = new Post(newPostData);

    await newPost.save();
    res.status(200).json({ message: "Post creado con exito" });
  } catch (error) {
    res.status(500).json({ message: "Error en la creacion de la publicacion" });
  }
});

//EndPoint de dar like

app.put("/posts/:postId/:userId/like", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId).populate("user", "name");
    const updatePost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!updatePost) {
      return res.status(404).json({ message: "publicacion no encontrada" });
    }

    updatePost.user = post.user;

    res.json(updatePost);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "ocurrio un error en el backend a la hora de dar like",
    });
  }
});

//endPoint de dislike
app.put("/posts/:postId/:userId/unlike", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;

  try {
    const post = await Post.findById(postId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );

    updatedPost.user = post.user;

    if (!updatedPost) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Error unliking post:", error);
    res
      .status(500)
      .json({ message: "ocurrio un error a la hora de dar dislike" });
  }
});

//endPoint para obtener todas las publicaciones
app.get("/get-posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: " ocurrion un error a la hora de obtener los post" });
  }
});

//guardar un comentario de un post

app.post("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const { userId, content } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    const comment = {
      user: userId,
      content: content,
      createdAt: Date.now(),
    };

    post.comments.push(comment);

    await post.save();

    res.status(200).json({ message: "Comentario añadido con éxito", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "error mientras buscas el profile" });
  }
});
//
//ENDPORINT SCREEN PROFILE
//

app.post("/profile", async (req, res) => {
  try {
    const { userId, nameProfile, surname, telephone, presentation } = req.body;

    // Busca al usuario por su ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Crea un nuevo perfil
    const profile = new Profile({
      nameProfile,
      surname,
      telephone,
      presentation,
    });

    // Guarda el perfil
    await profile.save();

    // Asigna el perfil al usuario
    user.profileId = profile._id;
    await user.save();

    res.json({ message: "Perfil guardado exitosamente", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hubo un error al guardar el perfil" });
  }
});

//endPoint para alamcennar el Apellido
//endPoint para alamcennar el Presentacion
//endPoint para alamcennar el Telefono
