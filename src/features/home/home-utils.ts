import type { HomeFeedSection } from '@/lib/api/home'

export function homeSectionId(section: HomeFeedSection) {
  return `home-section-${section.id}`
}

export function scrollToHomeSection(sectionId: string) {
  const element = document.getElementById(sectionId)

  if (!element) {
    return
  }

  window.scrollTo({
    top: Math.max(window.scrollY + element.getBoundingClientRect().top - 16, 0),
    behavior: 'smooth'
  })
}
