import { fetchSpace } from '../services/fetch-space'
import { updateSpace } from '../services/update-space'

export const createNewCategory = async (space: string, category: string) => {
  const spaceData = await fetchSpace(space)

  const categories = spaceData.categories

  const mayHasCategory = categories?.findIndex((item) => item === category)
  if (mayHasCategory === undefined || !categories) {
    await updateSpace(space, {
      ...spaceData,
      categories: [category],
    })
    return { categories: [category], index: 0 }
  }
  spaceData.categories?.push(category)
  await updateSpace(space, spaceData)
  return {
    categories: spaceData.categories as string[],
    index: mayHasCategory >= 0 ? mayHasCategory : categories.length - 1,
  }
}
