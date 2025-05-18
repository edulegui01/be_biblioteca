import { UserModel } from '../models/user.model.js'
import 'dotenv/config';
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ ok: false, msg: "Missing required fields: email, password, username" })
        }

        const user = await UserModel.findOneByEmail(email)
        if (user) {
            return res.status(409).json({ ok: false, msg: "Email already exists" })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = await UserModel.create({ email, password: hashedPassword, username })

        const token = jwt.sign({ email: newUser.email, role_id: newUser.role_id },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        )

        return res.status(201).json({
            ok: true,
            msg: {
                token, role_id: newUser.role_id
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Verificar si el usuario existe
        const user = await UserModel.findOneByEmail(email);
        if (!user) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ ok: false, msg: 'Contraseña incorrecta' });
        }

        // Generar el token
        const token = jwt.sign(
            { uid: user.uid, email: user.email, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );


        res.json({
            ok: true,
            token,
            user: {
                uid: user.uid,
                email: user.email,
                username: user.username,
                role_id: user.role_id
            }
        });

    }catch(error){
        console.log(error)
        return res.status(500).json({ ok: false, msg: "Error creating user", error: error.message })
    }
}







const findAll = async (req, res) => {
    try {
        const users = await UserModel.findAll()

        return res.json({ ok: true, msg: users })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}

export const UserController = {
    register,
    findAll,
    login
}