import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Biblioteca',
            version: '1.0.0',
            description: 'API para gestión de biblioteca',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo',
            },
        ],
        components: {
            schemas: {
                Book: {
                    type: 'object',
                    required: ['title', 'isbn', 'qr_code'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID único del libro'
                        },
                        title: {
                            type: 'string',
                            description: 'Título del libro'
                        },
                        author: {
                            type: 'string',
                            description: 'Autor del libro'
                        },
                        isbn: {
                            type: 'string',
                            description: 'ISBN del libro'
                        },
                        qr_code: {
                            type: 'string',
                            description: 'Código QR del libro'
                        },
                        shelf: {
                            type: 'string',
                            description: 'Estante donde se encuentra el libro'
                        },
                        available: {
                            type: 'boolean',
                            description: 'Disponibilidad del libro'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación del registro'
                        }
                    }
                },
                User: {
                    type: 'object',
                    required: ['username', 'email', 'password'],
                    properties: {
                        uid: {
                            type: 'string',
                            description: 'ID único del usuario'
                        },
                        username: {
                            type: 'string',
                            description: 'Nombre de usuario'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Correo electrónico del usuario'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            description: 'Contraseña del usuario'
                        },
                        role_id: {
                            type: 'integer',
                            description: 'ID del rol del usuario'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación del registro'
                        }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        ok: {
                            type: 'boolean'
                        },
                        token: {
                            type: 'string'
                        },
                        user: {
                            type: 'object',
                            properties: {
                                uid: {
                                    type: 'string'
                                },
                                email: {
                                    type: 'string'
                                },
                                username: {
                                    type: 'string'
                                },
                                role_id: {
                                    type: 'integer'
                                }
                            }
                        }
                    }
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/app/controllers/*.js'], // archivos que contienen las anotaciones
};

export const specs = swaggerJsdoc(options); 