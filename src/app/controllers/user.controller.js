import { UserModel } from '../models/user.model.js'
import 'dotenv/config';
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 msg:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     role_id:
 *                       type: integer
 *       400:
 *         description: Campos requeridos faltantes
 *       409:
 *         description: El email ya existe
 */
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

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Contraseña incorrecta
 *       404:
 *         description: Usuario no encontrado
 */
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

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 msg:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 */
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