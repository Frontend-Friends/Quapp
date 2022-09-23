import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {Container} from "@mui/material";

const Nav = () => {
    // const { user, logout } = useAuth()
    const user = ""
    const logout = () =>  {}
    const router = useRouter()

    return (
            <Container>


                    <div className="me-auto">
                        {user ? (
                            <div>
                                <div
                                    onClick={() => {
                                        logout()
                                        router.push('/login')
                                    }}
                                >
                                    Logout
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link href="/Signup" passHref>
                                    <div>Signup</div>
                                </Link>
                                <Link href="/Login" passHref>
                                    <div>Login</div>
                                </Link>
                            </>
                        )}
                    </div>
            </Container>
    )
}

export default Nav