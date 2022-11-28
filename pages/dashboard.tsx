import React from 'react'
import { withIronSessionSsr } from 'iron-session/next'
import { ironOptions } from '../lib/config'
import { User } from '../interfaces/user'

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  const { user } = req.session
  return {
    props: { isLoggedIn: !!user, user },
  }
}, ironOptions)

const Dashboard: React.FC<{ user?: User }> = ({ user }) => {
  return (
    <div>
      <h1> Hello {user?.firstName}!</h1> This route is protected. You can reach
      it by applying correct credentials.
    </div>
  )
}

export default Dashboard
