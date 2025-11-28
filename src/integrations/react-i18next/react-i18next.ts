import i18n from 'i18next'
import detector from 'i18next-browser-languagedetector'
import intervalPlural from 'i18next-intervalplural-postprocessor'
import { initReactI18next } from 'react-i18next'

import en from '../../locales/en/index.ts'

// ! Add language when adding new
export const languages = ['en'] as const
export type TAppLanguage = (typeof languages)[number]
// !Add NS when adding new one
export const translationNs = ['common'] as const
export type TAppTranslationsNs = (typeof translationNs)[number]
export const defaultNs = 'common' as const

const resources = { en }

export function getCountryName(code: string) {
  const regionNames = new Intl.DisplayNames([i18n.language], { type: 'region' })
  return regionNames.of(code.toUpperCase())
}

/**
 * Setup html lang changer
 */
i18n.on('languageChanged', (lng) => {
  const language = lng.split('-')[0] ?? lng
  document.documentElement.setAttribute('lang', language)
})

/**
 * Setup translations
 */
const i18nInstance = i18n
  // if you're using a language detector, do not define the lng option
  .use(detector)
  .use(intervalPlural)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    defaultNS: 'common',
    nsSeparator: ':',
    fallbackLng: 'en',
    // ns: translationNs,
    ns: [defaultNs],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      convertDetectedLanguage: (lng) => lng.split('-')[0],
    },
    supportedLngs: languages,
    nonExplicitSupportedLngs: true,
    resources,
    saveMissing: true, // for missing key handler to fire
    missingKeyHandler: import.meta.env.DEV
      ? (lng, ns, key) => console.warn(`${lng}-${ns}:${key}`)
      : undefined,
    react: { useSuspense: true },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18nInstance
