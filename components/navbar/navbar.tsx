import Link from 'next/link'

export default function Navbar() {
  return (
    <div>
    
      <Link href="/">D.A.E.A App</Link>

      <li>
        <Link href="/auth/login">
          <h1>Login</h1>
        </Link>
      </li>

    </div>
  )
}