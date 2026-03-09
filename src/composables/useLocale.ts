import { computed, ref } from 'vue'

export type DocLocale = 'zh' | 'en'

const STORAGE_KEY = 'cropper-next-vue-doc-locale'
const localeState = ref<DocLocale>('zh')

const getSavedLocale = (): DocLocale => {
  if (typeof window === 'undefined') {
    return 'zh'
  }
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved === 'en' ? 'en' : 'zh'
}

localeState.value = getSavedLocale()

export const useLocale = () => {
  const setLocale = (value: DocLocale) => {
    localeState.value = value
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, value)
      document.documentElement.lang = value === 'en' ? 'en' : 'zh-CN'
    }
  }

  const toggleLocale = () => {
    setLocale(localeState.value === 'zh' ? 'en' : 'zh')
  }

  return {
    locale: computed(() => localeState.value),
    isZh: computed(() => localeState.value === 'zh'),
    isEn: computed(() => localeState.value === 'en'),
    setLocale,
    toggleLocale,
  }
}
