import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { ReactNode } from "react"
import { Navigate } from "react-router-dom"

interface Props{
    children: ReactNode
}

const ProtectedRoute = ({children}:Props) => {
  return (
    <>
        <SignedIn>{children}</SignedIn>
        <SignedOut><Navigate to="/"/></SignedOut>
    </>
  )
}

export default ProtectedRoute