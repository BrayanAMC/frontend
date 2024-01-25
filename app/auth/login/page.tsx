import Link from 'next/link'
import  LoginForm  from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-slate-100">
      <div className="sm:shadow-xl px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-12">
        <h1 className="font-semibold text-2xl">Inicia Sesión</h1>
        <LoginForm />
        <p className="text-center">
          ¿No tienes cuenta? {' '}
          <Link className="text-indigo-500 hover:underline" href="/auth/register">
            Crea Una
          </Link>{' '}
        </p>
      </div>
    </div>
  )
}