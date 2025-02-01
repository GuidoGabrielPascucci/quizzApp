//#region IMPORTS
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { config } from "dotenv";
import { safeParse } from "valibot";

import { userSchema } from "./src/schemas/userSchema.js"
import { loginSchema } from "./src/schemas/loginSchema.js";
//#endregion

const app = express();
app.use(express.json());

//#region VARIABLES DE ENTORNO
config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT ?? 3000;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
//#endregion

//#region CONEXIÓN A MONGODB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//#endregion

//#region MODELS
const User = mongoose.model("User", userSchema);
//#endregion

//#region RUTAS
app.get("/", (req, res) => {
    res.send("Servidor funciona");
})

app.post("/signup", async (req, res) => {
    // Registrar un usuario en MongoDB
    // PUEDO USAR LOS MÉTODOS SAVE O CREATE.
    try {
        // TENGO QUE CORROBORAR EN UN MW QUE ESTO VENGA SANITIZADO!
        const user = req.body;
        // Generar un hash seguro para la contraseña
        const hashedPassword = await hash(user.password, 10);
        user.password = hashedPassword;
        const createdUser = await User.create(user);
        res
            .status(201)
            .json({
                message: "User registered successfully",
                user: createdUser
            });
    } catch (err) {
        res
            .status(500)
            .json({
                message: "An error may have occured"
            });
        console.error(err);
    }

    /* OTRA MANERA
    try {
        const { firstName, lastName, email, password } = req.body;
 
        // Generar un hash seguro para la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
 
        // Crear usuario con la contraseña cifrada
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
 
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
    */
})

function validateLoginFieldsMw(req, res, next) {
    if (req.body.email && req.body.password) {
        next();
        return;
    }

    res.status(400).json({
        success: false,
        message: "You must enter both fields to login."
    })
}

function sanitizeLoginMw(req, res, next) {
    const loginData = {
        email: req.body.email,
        password: req.body.password
    };

    const result = safeParse(loginSchema, loginData);
    console.log(result);

    if (!result.success) {
        res.status(400).json({
            success: false,
            message: result.issues[0].message
        })
        return;
    }

    next();
}

app.post("/login", validateLoginFieldsMw, sanitizeLoginMw, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({ message: "There's no such an email" });
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const accessToken = jwt.sign({...user}, JWT_SECRET_KEY, { expiresIn: "1h" })

        res.status(200).json({
            message: "You are logged!",
            accessToken
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error may have occurred" });
    }
})
//#endregion

app.listen(PORT, () => {
    console.log(`\n--------------------------------------------------------\n`);
    console.log(`Server running on port ${PORT}\n`);
    console.log(`--------------------------------------------------------\n`);
})