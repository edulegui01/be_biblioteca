import db from '../config/db.js';

const create = async ({ email, password, username }) => {
  try {
    const query = {
      text: `
      INSERT INTO users (email, password, username)
      VALUES ($1, $2, $3)
      RETURNING email, username, uid, role_id
      `,
      values: [email, password, username]
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    throw new Error(`Error al crear usuario: ${error.message}`)
  }
}

const findOneByEmail = async (email) => {
  try {
    const query = {
      text: `
      SELECT * FROM users
      WHERE EMAIL = $1
      `,
      values: [email]
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    throw new Error(`Error al buscar usuario por email: ${error.message}`)
  }
}

const findAll = async () => {
  try {
    const query = {
      text: `
      SELECT * FROM users
      `
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    throw new Error(`Error al obtener todos los usuarios: ${error.message}`)
  }
}

const findOneByUid = async (uid) => {
  try {
    const query = {
      text: `
      SELECT * FROM users
      WHERE uid = $1
      `,
      values: [uid]
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    throw new Error(`Error al buscar usuario por uid: ${error.message}`)
  }
}

const updateRoleVet = async (uid) => {
  try {
    const query = {
      text: `
      UPDATE users
      SET role_id = 2
      WHERE uid = $1
      RETURNING *
      `,
      values: [uid]
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    throw new Error(`Error al actualizar rol de veterinario: ${error.message}`)
  }
}

export const UserModel = {
  create,
  findOneByEmail,
  findAll,
  findOneByUid,
  updateRoleVet
}