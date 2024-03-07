import Image from 'next/image'
import vicuna04 from '@/img/vicuna04.jpg'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className=" bg-[#16202a] flex items-center justify-center h-screen">
      <div className="w-1/2 text-center p-4">
        <h1 className="text-6xl font-bold text-white mb-4">Bienvenido</h1>
        <p className="text-2xl text-white">Disfruta de nuestra plataforma</p>
        <div className='text-2xl text-white mt-6'>
        <Link href="/auth/login  ">
            <h1>Login</h1>
        </Link>
        </div>
      </div>
      <div className="w-1/2 relative h-full">
        <Image className="absolute top-0 left-0 object-cover" src={vicuna04} alt="vicuna" layout="fill" sizes="50vw" />
      </div>
    </div>
  )
}