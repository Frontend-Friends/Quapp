import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container } from "@mui/material";
import { useAuth } from "../../components/context/auth-context";

const Nav = () => {
  //  @ts-ignore
  const { user, logout } = useAuth();

  const router = useRouter();

  return (
    <Container>
      <div className="me-auto">
        {user ? (
          <div>
            <button
              onClick={() => {
                logout();
                router.push("/Login").then();
              }}
            >
              <h2>You are logged in</h2>
              Logout
            </button>
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
  );
};

export default Nav;
