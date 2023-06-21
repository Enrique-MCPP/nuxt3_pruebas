import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "default"
declare module "C:/Users/emalc/OneDrive/Escritorio/nuxt3_pruebas/nuxt3_pruebas/nuxt3-auth-example-main/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}