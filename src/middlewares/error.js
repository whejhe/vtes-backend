//backend/src/middlewares/error.js
export const errorMiddleware = (err, req, res, next) => {
    console.log(err.stack);

    let statusCode = err.statusCode || 500;
    let errMessage = err.message || 'Ocurrio un error inesperado';

    switch (statusCode) {
        case 400:
            errMessage = 'Los datos proporcionados no son válidos (400)';
            break;
        case 401:
            errMessage = 'No está autorizado para realizar esta acción (401)';
            break;
        case 402:
            errMessage = 'Se requiere un pago (402)';
            break;
        case 403:
            errMessage = 'Acceso denegado (403)';
            break;
        case 404:
            errMessage = 'No se encontró lo que estaba buscando (404)';
            break;
        case 405:
            errMessage = 'Método no permitido (405)';
            break;
        case 406:
            errMessage = 'No se aceptan los datos proporcionados (406)';
            break;
        case 407:
            errMessage = 'Se requiere autenticación de proxy (407)';
            break;
        case 408:
            errMessage = 'Tiempo de espera de la aplicación agotado (408)';
            break;
        case 409:
            errMessage = 'Existe un conflicto con los datos proporcionados (409)';
            break;
        case 410:
            errMessage = 'El recurso ya no existe (410)';
            break;
        case 411:
            errMessage = 'Se requiere una longitud (411)';
            break;
        case 412:
            errMessage = 'Precondición fallada (412)';
            break;
        case 413:
            errMessage = 'El contenido del paquete es demasiado grande (413)';
            break;
        case 414:
            errMessage = 'La URI es demasiado larga (414)';
            break;
        case 415:
            errMessage = 'Tipo de contenido no admitido (415)';
            break;
        case 416:
            errMessage = 'Rango no satisfactorio (416)';
            break;
        case 417:
            errMessage = 'Esperando fallada (417)';
            break;
        case 422:
            errMessage = 'Entidad no procesable (422)';
            break;
        case 423:
            errMessage = 'Bloqueado (423)';
            break;
        case 424:
            errMessage = 'Fallo de dependencia (424)';
            break;
        case 426:
            errMessage = 'Se requiere actualización (426)';
            break;
        case 428:
            errMessage = 'Se requiere una precondición (428)';
            break;
        case 429:
            errMessage = 'Demasiadas solicitudes en un período corto de tiempo (429)';
            break;
        case 431:
            errMessage = 'Las cabeceras de la solicitud son demasiado grandes (431)';
            break;
        case 452:
            errMessage = 'No disponible para razones legales (452)';
            break;
        case 500:
            errMessage = 'Error interno del servidor (500)';
            break;
        case 501:
            errMessage = 'Este método no está disponible (501)';
            break;
        case 502:
            errMessage = 'Error de gateway (502)';
            break;
        case 503:
            errMessage = 'Servicio no disponible (503)';
            break;
        case 504:
            errMessage = 'Tiempo de espera de la aplicación agotado (504)';
            break;
        case 505:
            errMessage = 'Versión HTTP no admitida (505)';
            break;
        case 506:
            errMessage = 'Variant Also Negotiates (506)';
            break;
        case 507:
            errMessage = 'Almacenamiento insuficiente (507)';
            break;
        case 508:
            errMessage = 'Ciclo detectado (508)';
            break;
        case 509:
            errMessage = 'Limite de ancho de banda excedido (509)';
            break;
        case 510:
            errMessage = 'No extendido (510)';
        case 511:
            errMessage = 'Se requiere autenticación de red (511)';
            break;
        default:
            errMessage = 'Ocurrió un error inesperado';
            break;
    }

    res.status(statusCode).send({ error: errMessage });
};

export const error = (app) => {
    app.use(errorMiddleware);
};
