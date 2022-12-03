export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'QUAPP_SESSION',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
