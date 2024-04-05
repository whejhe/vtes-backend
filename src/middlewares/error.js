//backend/src/middlewares/error.js
export const errorMiddleware = (err, req, res, next) => {
    console.log(err.stack);

    let statusCode = 500;
    let errMessage = 'Error interno del servidor';

    switch (err.name) {
        case 'ValidationError':
            statusCode = 400;
            errMessage = 'Los datos proporcionados no son válidos';
            break;
        case 'NotFoundError':
            statusCode = 404;
            errMessage = 'No se encontró lo que estaba buscando';
            break;
        case 'UnauthorizedError':
            statusCode = 401;
            errMessage = 'No está autorizado para realizar esta acción';
            break;
        case 'ForbiddenError':
            statusCode = 403;
            errMessage = 'Acceso denegado';
            break;
        case 'BadRequestError':
            statusCode = 400;
            errMessage = 'Solicitud inválida';
            break;
        case 'ConflictError':
            statusCode = 409;
            errMessage = 'Existe un conflicto con los datos proporcionados';
            break;
        case 'TooManyRequestsError':
            statusCode = 429;
            errMessage = 'Demasiadas solicitudes en un período corto de tiempo';
            break;
        default:
            statusCode = 500;
            errMessage = 'Ocurrió un error inesperado';
            break;
    }

    res.status(statusCode).send({ error: errMessage });
};

export const error = (app) => {
    app.use(errorMiddleware);
};
