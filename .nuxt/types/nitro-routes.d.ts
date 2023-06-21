// Generated by nitro
import type { Serialize, Simplify } from 'nitropack'
declare module 'nitropack' {
  type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T
  interface InternalApi {
    '/api/users': {
      'get': Simplify<Serialize<Awaited<ReturnType<typeof import('../../server/api/users/index.get').default>>>>
    }
    '/auth/login': {
      'post': Simplify<Serialize<Awaited<ReturnType<typeof import('../../server/routes/auth/login.post').default>>>>
    }
    '/auth/logout': {
      'post': Simplify<Serialize<Awaited<ReturnType<typeof import('../../server/routes/auth/logout.post').default>>>>
    }
    '/auth/me': {
      'get': Simplify<Serialize<Awaited<ReturnType<typeof import('../../server/routes/auth/me.get').default>>>>
    }
    '/__nuxt_error': {
      'default': Simplify<Serialize<Awaited<ReturnType<typeof import('../../node_modules/nuxt/dist/core/runtime/nitro/renderer').default>>>>
    }
  }
}
export {}