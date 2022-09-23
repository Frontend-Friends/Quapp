import { useRouter } from 'next/router'
import React, { useState } from 'react'
// import { useAuth } from '../context/AuthContext'
import Button from '@mui/material/Button';
import {FormGroup, Input} from "@mui/material";



const Login = () => {
    const router = useRouter()
    // const { user, login } = useAuth()
    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const handleLogin = async (e: any) => {
        e.preventDefault()

        // console.log(user)
        try {
            console.log(data);
            // await login(data.email, data.password)
            router.push('/Dashboard')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div
            style={{
                width: '40%',
                margin: 'auto',
            }}
        >
            <h1 className="text-center my-3 ">Login</h1>
            <form onSubmit={handleLogin}>
                <FormGroup className="mb-3">
                    <label>Email address</label>
                    <Input
                        onChange={(e: any) =>
                            setData({
                                ...data,
                                email: e.target.value,
                            })
                        }
                        value={data.email}
                        required
                        type="email"
                        placeholder="Enter email"
                    />
                </FormGroup>

                <FormGroup className="mb-3" >
                    <label>Password</label>
                    <Input
                        onChange={(e: any) =>
                            setData({
                                ...data,
                                password: e.target.value,
                            })
                        }
                        value={data.password}
                        required
                        type="password"
                        placeholder="Password"
                    />
                </FormGroup>
                <Button  type="submit">
                    Login
                </Button>
            </form>
        </div>
    )
}

export default Login