import { getDatabase, ref, set } from 'firebase/database'

declare module 'iron-session' {
  interface IronSessionData {
    //@ts-ignore
    user?: {
      email: string
      password: string
    }
  }
}

async function database(
  userId: string,
  name: string,
  email: string,
  phone: string,
  firstName: string,
  lastName: string
) {
  try {
    const db = getDatabase()
    await set(ref(db, 'users/' + userId), {
      email: 'test',
    })
  } catch (error) {
    console.error(error)
    //error.status(500).json({ message: (error as Error).message })
  }
}

export default database
