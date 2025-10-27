import type { HandleServerError } from '@sveltejs/kit';
import { DomainError } from '$lib/errors/DomainError';

/**
 * Manejador centralizado de errores del servidor.
 * Captura errores no controlados y devuelve una respuesta estructurada.
 */
export const handleError: HandleServerError = ({ error }) => {
    console.error('Error no controlado:', error);

    if (error instanceof DomainError) {
        return {
            message: error.message,
            code: error.code
        };
    }

    return {
        message: 'Ocurrió un error inesperado',
        code: 'UNEXPECTED_ERROR'
    };
};
