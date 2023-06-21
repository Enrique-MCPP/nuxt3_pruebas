import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = "admin-only" | "guest-only" | "user-only"
declare module "C:/Users/emalc/OneDrive/Escritorio/nuxt3_pruebas/nuxt3_pruebas/nuxt3-auth-example-main/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}