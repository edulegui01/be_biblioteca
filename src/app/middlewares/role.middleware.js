export const verifyRole = (roles) => {
    return (req, res, next) => {
        // roles puede ser un número o un array de números
        const userRole = req.user.role_id;
        
        console.log('Role del usuario:', userRole);
        console.log('Roles permitidos:', roles);

        if (!roles.includes(userRole)) {
            return res.status(403).json({ 
                ok: false, 
                msg: 'No tienes permisos para realizar esta acción' 
            });
        }

        next();
    };
};