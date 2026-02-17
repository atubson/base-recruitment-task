import { ref, onMounted, onUnmounted } from 'vue'

/** 768px and less = mobile view */
const MEDIA_QUERY = '(max-width: 768px)'

export const useMobileView = () => {
    const isMobileView = ref(
        typeof window !== 'undefined' ? window.matchMedia(MEDIA_QUERY).matches : false
    )
    let mediaQuery: MediaQueryList | null = null

    const update = (mq: MediaQueryList) => {
        isMobileView.value = mq.matches
    }

    onMounted(() => {
        mediaQuery = window.matchMedia(MEDIA_QUERY)
        update(mediaQuery)
        mediaQuery.addEventListener('change', update)
    })

    onUnmounted(() => {
        if (mediaQuery) {
            mediaQuery.removeEventListener('change', update)
        }
    })

    return { isMobileView }
}
