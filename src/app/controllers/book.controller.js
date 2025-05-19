import { BookModel } from '../models/book.model.js'

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Crear un nuevo libro
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - isbn
 *               - qr_code
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               qr_code:
 *                 type: string
 *               shelf:
 *                 type: string
 *     responses:
 *       201:
 *         description: Libro creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Campos requeridos faltantes
 *       409:
 *         description: ISBN o código QR ya existe
 */
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

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Obtener lista de libros paginada
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de elementos por página
 *     responses:
 *       200:
 *         description: Lista de libros
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
 *                     books:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Book'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         nextPage:
 *                           type: string
 *                           nullable: true
 *                         prevPage:
 *                           type: string
 *                           nullable: true
 */
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

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Obtener un libro por ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del libro
 *     responses:
 *       200:
 *         description: Libro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Libro no encontrado
 */
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

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Actualizar un libro
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del libro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               qr_code:
 *                 type: string
 *               shelf:
 *                 type: string
 *               available:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Libro actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Libro no encontrado
 *       409:
 *         description: ISBN o código QR ya existe
 */
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

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Eliminar un libro
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del libro
 *     responses:
 *       200:
 *         description: Libro eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Libro no encontrado
 */
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

/**
 * @swagger
 * /api/books/{id}/availability:
 *   patch:
 *     summary: Actualizar disponibilidad de un libro
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del libro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - available
 *             properties:
 *               available:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Disponibilidad actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Campo available es requerido
 *       404:
 *         description: Libro no encontrado
 */
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
