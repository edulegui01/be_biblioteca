import { UserModel } from '../models/user.model.js'
import bcryptjs from 'bcryptjs'


const register = async (req, res) => {

    try{
        const { username,password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ ok: false, msg: "Missing required fields: password, username" })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = await UserModel.create({ username, password: hashedPassword })

        return res.status(201).json({ ok: true, msg: "User created successfully", user: newUser })
    }
    catch(error){
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
    findAll
}