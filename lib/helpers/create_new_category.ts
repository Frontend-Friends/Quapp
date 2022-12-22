import { fetchSpace } from '../services/fetch-space'
import { updateSpace } from '../services/update-space'

export const createNewCategory = async (space: string, category: string) => {
  const spaceData = await fetchSpace(space)

  const categories = spaceData.categories

  const mayHasCategory = categories?.findIndex((item) => item === category)
  if (mayHasCategory === undefined) {
    await updateSpace(space, {
      ...spaceData,
      categories: [category],
    })
    return 0
  }
  if (mayHasCategory > -1) {
    return mayHasCategory
  }
  spaceData.categories?.push(category)
  await updateSpace(space, spaceData)
  return spaceData.categories ? spaceData.categories.length - 1 : ''
}
