import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class HealthChecksController {
  async handle({ response }: HttpContext) {
    // Vérification basique pour Railway healthcheck
    const basicHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    }

    // Vérification DB optionnelle (ne bloque pas le healthcheck)
    try {
      await db.rawQuery('SELECT 1')
      return response.ok({
        ...basicHealth,
        database: 'connected',
      })
    } catch {
      // Retourne OK même si DB échoue (pour que Railway accepte le deploy)
      // Mais signale que la DB n'est pas connectée
      return response.ok({
        ...basicHealth,
        database: 'disconnected',
        warning: 'Database connection failed',
      })
    }
  }
}
