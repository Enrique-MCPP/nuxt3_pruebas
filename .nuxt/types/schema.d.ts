import { NuxtModule, RuntimeConfig } from 'nuxt/schema'
declare module 'nuxt/schema' {
  interface NuxtConfig {
    ["unocss"]?: typeof import("@unocss/nuxt").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["formkit"]?: typeof import("@formkit/nuxt").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule | string | [NuxtModule | string, Record<string, any>] | ["@unocss/nuxt", Exclude<NuxtConfig["unocss"], boolean>] | ["@formkit/nuxt", Exclude<NuxtConfig["formkit"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
  interface RuntimeConfig {
   app: {
      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },

   cookieName: string,

   cookieSecret: string,

   cookieExpires: number,

   cookieRememberMeExpires: number,
  }
  interface PublicRuntimeConfig {

  }
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: RuntimeConfig
        }
      }