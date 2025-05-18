import { BookModel } from '../models/book.model.js'

const create = async (req, res) => {
    try {
        const { title, author, isbn, qr_code, shelf } = req.body

        if (!title || !isbn || !qr_code) {
            return res.status(400).json({ 
                ok: false, 
                msg: "Campos requeridos faltantes: título, ISBN y código QR" 
            })
        }

        // Verificar si el ISBN ya existe
        const existingBook = await BookModel.findOneByIsbn(isbn)
        if (existingBook) {
            return res.status(409).json({ 
                ok: false, 
                msg: "El ISBN ya está registrado" 
            })
        }

        // Verificar si el código QR ya existe
        const existingQr = await BookModel.findOneByQrCode(qr_code)
        if (existingQr) {
            return res.status(409).json({ 
                ok: false, 
                msg: "El código QR ya está registrado" 
            })
        }

        const newBook = await BookModel.create({ 
            title, 
            author, 
            isbn, 
            qr_code, 
            shelf 
        })

        return res.status(201).json({
            ok: true,
            msg: newBook
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error del servidor'
        })
    }
}

const findAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const [books, total] = await Promise.all([
            BookModel.findAll(page, limit),
            BookModel.countTotal()
        ]);

        const totalPages = Math.ceil(total / limit);
        
        // Solo enviamos los parámetros de paginación
        const nextPage = page < totalPages ? `?page=${page + 1}&limit=${limit}` : null;
        const prevPage = page > 1 ? `?page=${page - 1}&limit=${limit}` : null;

        return res.json({ 
            ok: true, 
            msg: {
                books,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages,
                    nextPage,
                    prevPage
                }
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error del servidor'
        })
    }
}

const findOneById = async (req, res) => {
    try {
        const { id } = req.params
        const book = await BookModel.findOneById(id)
        
        if (!book) {
            return res.status(404).json({ 
                ok: false, 
                msg: "Libro no encontrado" 
            })
        }

        return res.json({ 
            ok: true, 
            msg: book 
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error del servidor'
        })
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params
        const { title, author, isbn, qr_code, shelf, available } = req.body

        // Verificar si el libro existe
        const existingBook = await BookModel.findOneById(id)
        if (!existingBook) {
            return res.status(404).json({ 
                ok: false, 
                msg: "Libro no encontrado" 
            })
        }

        // Si se está actualizando el ISBN, verificar que no exista
        if (isbn && isbn !== existingBook.isbn) {
            const bookWithIsbn = await BookModel.findOneByIsbn(isbn)
            if (bookWithIsbn) {
                return res.status(409).json({ 
                    ok: false, 
                    msg: "El ISBN ya está registrado" 
                })
            }
        }

        // Si se está actualizando el QR, verificar que no exista
        if (qr_code && qr_code !== existingBook.qr_code) {
            const bookWithQr = await BookModel.findOneByQrCode(qr_code)
            if (bookWithQr) {
                return res.status(409).json({ 
                    ok: false, 
                    msg: "El código QR ya está registrado" 
                })
            }
        }

        const updatedBook = await BookModel.update(id, {
            title: title || existingBook.title,
            author: author || existingBook.author,
            isbn: isbn || existingBook.isbn,
            qr_code: qr_code || existingBook.qr_code,
            shelf: shelf || existingBook.shelf,
            available: available !== undefined ? available : existingBook.available
        })

        return res.json({
            ok: true,
            msg: updatedBook
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error del servidor'
        })
    }
}

const remove = async (req, res) => {
    try {
        const { id } = req.params

        // Verificar si el libro existe
        const existingBook = await BookModel.findOneById(id)
        if (!existingBook) {
            return res.status(404).json({ 
                ok: false, 
                msg: "Libro no encontrado" 
            })
        }

        const deletedBook = await BookModel.remove(id)
        return res.json({
            ok: true,
            msg: deletedBook
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error del servidor'
        })
    }
}

const updateAvailability = async (req, res) => {
    try {
        const { id } = req.params
        const { available } = req.body

        if (available === undefined) {
            return res.status(400).json({
                ok: false,
                msg: "El campo 'available' es requerido"
            })
        }

        // Verificar si el libro existe
        const existingBook = await BookModel.findOneById(id)
        if (!existingBook) {
            return res.status(404).json({ 
                ok: false, 
                msg: "Libro no encontrado" 
            })
        }

        const updatedBook = await BookModel.updateAvailability(id, available)
        return res.json({
            ok: true,
            msg: updatedBook
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error del servidor'
        })
    }
}

export const BookController = {
    create,
    findAll,
    findOneById,
    update,
    remove,
    updateAvailability
}
