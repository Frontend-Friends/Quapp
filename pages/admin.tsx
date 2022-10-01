import { withIronSessionSsr } from 'iron-session/next'

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session

    if (!user.admin) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        user: req.session.user,
      },
    }
  },
  {
    cookieName: '__session',
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }
)
