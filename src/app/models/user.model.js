import db from '../config/db.js';

const create = async ({ password, username }) => {
    const query = {
        text: `
        INSERT INTO users (password, username)
        VALUES ($1, $2)
        RETURNING username, user_id, role_id
        `,
        values: [password, username]
    }

    const { rows } = await db.query(query)
    return rows[0]
}

const findAll = async () => {
    const query = {
        text: `
        SELECT * FROM users
        `
    }
    const { rows } = await db.query(query)
    return rows
}

const findOneByUid = async (uid) => {
    const query = {
        text: `
        SELECT * FROM users
        WHERE user_id = $1
        `,
        values: [uid]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

const updateRoleVet = async (uid) => {
    const query = {
        text: `
        UPDATE users
        SET role_id = 2
        WHERE user_id = $1
        RETURNING *
        `,
        values: [uid]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

export const UserModel = {
    create,
    findAll,
    findOneByUid,
    updateRoleVet
}