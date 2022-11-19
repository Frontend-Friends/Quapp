export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'QAPP_USER',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
