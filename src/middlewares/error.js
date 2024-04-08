//backend/src/middlewares/error.js
const errorCodes = {
    400: 'Los datos proporcionados no son válidos (400)',
    401: 'No está autorizado para realizar esta acción (401)',
    402: 'Se requiere un pago (402)',
    403: 'Acceso denegado (403)',
    404: 'No se encontró lo que estaba buscando (404)',
    405: 'Método no permitido (405)',
    406: 'No se aceptan los datos proporcionados (406)',
    407: 'Se requiere autenticación de proxy (407)',
    408: 'Tiempo de espera de la aplicación agotado (408)',
    409: 'Existe un conflicto con los datos proporcionados (409)',
    410: 'El recurso ya no existe (410)',
    411: 'Se requiere una longitud (411)',
    412: 'Precondición fallada (412)',
    413: 'El contenido del paquete es demasiado grande (413)',
    414: 'La URI es demasiado larga (414)',
    415: 'Tipo de contenido no admitido (415)',
    416: 'Rango no satisfactorio (416)',
    417: 'Esperando fallada (417)',
    422: 'Entidad no procesable (422)',
    423: 'Bloqueado (423)',
    424: 'Fallo de dependencia (424)',
    426: 'Se requiere actualización (426)',
    428: 'Se requiere una precondición (428)',
    429: 'Demasiadas solicitudes en un período corto de tiempo (429)',
    431: 'Las cabeceras de la solicitud son demasiado grandes (431)',
    452: 'No disponible para razones legales (452)',
    500: 'Error interno del servidor (500)',
    501: 'Este método no está disponible (501)',
    502: 'Error de gateway (502)',
    503: 'Servicio no disponible (503)',
    504: 'Tiempo de espera de la aplicación agotado (504)',
    505: 'Versión HTTP no admitida (505)',
    506: 'Variant Also Negotiates (506)',
    507: 'Almacenamiento insuficiente (507)',
    508: 'Ciclo detectado (508)',
    509: 'Limite de ancho de banda excedido (509)',
    510: 'No extendido (510)',
    511: 'Se requiere autenticación de red (511)',
};

export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errMessage = errorCodes[statusCode] || 'Ocurrió un error inesperado';

    res.status(statusCode).send({ error: errMessage });
};

export const error = (app) => {
    app.use(errorMiddleware);
};
