import type { ComicChapter } from '@/lib/api/comic'
import type { ReaderChapterItem } from './types'

export function resolveReaderChapterInfo({
  currentReadId,
  chapters,
  fallback
}: {
  currentReadId: string
  chapters: ComicChapter[]
  fallback: string
}) {
  const chapterItems = toReaderChapterItems(chapters)
  const currentIndex = chapterItems.findIndex(chapter => chapter.id === currentReadId)
  const currentChapter = currentIndex >= 0 ? chapterItems[currentIndex] : null

  return {
    chapterTitle: currentChapter?.title ?? fallback.trim(),
    chapters: chapterItems,
    currentChapter,
    previousChapter: currentIndex >= 0 ? (chapterItems[currentIndex + 1] ?? null) : null,
    nextChapter: currentIndex >= 0 ? (chapterItems[currentIndex - 1] ?? null) : null
  }
}

export function toReaderChapterItems(chapters: ComicChapter[]): ReaderChapterItem[] {
  return sortChapters(chapters).map((chapter, index) => ({
    id: chapter.id,
    title: formatChapterTitle(chapter, index)
  }))
}

function formatChapterTitle(chapter: ComicChapter, index: number) {
  const title = chapter.title.trim()

  if (title.length > 0) {
    return title
  }

  return chapter.sort ? `第 ${chapter.sort} 章` : `章节 ${index + 1}`
}

function sortChapters(chapters: ComicChapter[]) {
  return [...chapters].sort((left, right) => {
    const leftSort = Number.parseInt(left.sort, 10)
    const rightSort = Number.parseInt(right.sort, 10)

    if (Number.isNaN(leftSort) || Number.isNaN(rightSort)) {
      return 0
    }

    return rightSort - leftSort
  })
}
