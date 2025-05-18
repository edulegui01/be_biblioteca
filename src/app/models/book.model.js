import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const create = async ({ title, author, isbn, qr_code, shelf }) => {
  try {
    const id = uuidv4();
    const query = {
      text: `
      INSERT INTO books (id, title, author, isbn, qr_code, shelf)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      values: [id, title, author, isbn, qr_code, shelf]
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    throw new Error(`Error al crear libro: ${error.message}`)
  }
}

const findOneByIsbn = async (isbn) => {
  try {
    const query = {
      text: `
      SELECT * FROM books
      WHERE isbn = $1
      `,
      values: [isbn]
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    throw new Error(`Error al buscar libro por ISBN: ${error.message}`)
  }
}

const findOneByQrCode = async (qr_code) => {
  try {
    const query = {
      text: `
      SELECT * FROM books
      WHERE qr_code = $1
      `,
      values: [qr_code]
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    throw new Error(`Error al buscar libro por código QR: ${error.message}`)
  }
}

const findAll = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    
    const query = {
      text: `
      SELECT * FROM books
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
      `,
      values: [limit, offset]
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    throw new Error(`Error al obtener todos los libros: ${error.message}`)
  }
}

const findOneById = async (id) => {
  try {
    const query = {
      text: `
      SELECT * FROM books
      WHERE id = $1
      `,
      values: [id]
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    throw new Error(`Error al buscar libro por ID: ${error.message}`)
  }
}

const update = async (id, { title, author, isbn, qr_code, shelf, available }) => {
  try {
    const query = {
      text: `
      UPDATE books
      SET title = $1, author = $2, isbn = $3, qr_code = $4, shelf = $5, available = $6
      WHERE id = $7
      RETURNING *
      `,
      values: [title, author, isbn, qr_code, shelf, available, id]
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    throw new Error(`Error al actualizar libro: ${error.message}`)
  }
}

const remove = async (id) => {
  try {
    const query = {
      text: `
      DELETE FROM books
      WHERE id = $1
      RETURNING *
      `,
      values: [id]
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    throw new Error(`Error al eliminar libro: ${error.message}`)
  }
}

const updateAvailability = async (id, available) => {
  try {
    const query = {
      text: `
      UPDATE books
      SET available = $1
      WHERE id = $2
      RETURNING *
      `,
      values: [available, id]
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    throw new Error(`Error al actualizar disponibilidad del libro: ${error.message}`)
  }
}

const countTotal = async () => {
  try {
    const query = {
      text: `
      SELECT COUNT(*) as total FROM books
      `
    }
    const { rows } = await db.query(query)
    return parseInt(rows[0].total)
  } catch (error) {
    throw new Error(`Error al contar libros: ${error.message}`)
  }
}

export const BookModel = {
  create,
  findOneByIsbn,
  findOneByQrCode,
  findAll,
  findOneById,
  update,
  remove,
  updateAvailability,
  countTotal
}
