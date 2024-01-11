require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const app = express();
app.use(express.json());
app.use(cors());

// const uri = `mongodb+srv://${process.env.MONGODB_USER}: ${MONGODB_PASSWORD}@ ${MONGODB_URI}`;
const uri =
  "mongodb+srv://franzpfitzer:MongoFranz04@cluster0.vq7cjhw.mongodb.net/?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Verbinden mit der Datenbank
async function connectToDatabase() {
  await mongoClient.connect();
  return mongoClient.db("userDB").collection("users");
}

// Endpunkt für die Registrierung
app.post("/register", async (req, res) => {
  const users = await connectToDatabase();

  const userData = {
    username: req.body.username,
    password: req.body.password,
  };

  const existingUser = await users.findOne({ username: userData.username });
  if (existingUser) {
    return res.status(400).send("Benutzer existiert bereits");

    // console.log(`Benutzer ${userData.username} existiert bereits`)
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;

  await users.insertOne(userData);
  res.status(201).send("Benutzer erfolgreich registriert");

  console.log(`Benutzer ${userData.username} wurder registriert`);
});

// Endpunkt für Login
app.post("/login", async (req, res) => {
  const users = await connectToDatabase();
  const { username, password } = req.body;

  const user = await users.findOne({ username });
  if (!user) {
    return res.status(401).send("user existiert nicht");
  }

  const passwordisValid = await bcrypt.compare(password, user.password);
  if (!passwordisValid) {
    return res.status(401).send("Passwort faslch");
  }
  const token = jwt.sign({username: user.username}, process.env.JWT_SECRET, {expiresIn: '1h'}) 

  // Login Logik hier (z.B. Session-Erstellung)
  res.status(200).json({token});
});

//Endpunkt zum Überprüfen des JWT:
app.post('/verify-token', async (req, res) => {
  console.log("/verify-token aufgerufen");
  const authheader = req.headers['authorization'];
  const token = authheader && authheader.split(' ')[1];   
  console.log(token);
  if (!token) {
      return res.status(401).send('Kein Token vorhanden');
  }
  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Token passt");
      console.log(decoded);
      res.status(200).send({isValid: true, user: req.user});
  } catch (err) {
      res.status(401).send('Token ist ungültig');
  }
});

const PORT = process.env.USERSERVICE_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
