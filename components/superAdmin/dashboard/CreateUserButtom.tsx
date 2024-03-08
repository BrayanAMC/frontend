import Link from 'next/link';

function CreateUserButtom() {

    return (
        <Link href="/superUser/auth/register">
          <button className="w-full h-full bg-[#26313c] hover:bg-green-700 text-white font-bold p-12 rounded flex items-center justify-center text-2xl shadow-lg">crear usuario</button>
        </Link>
      );
}

export default CreateUserButtom 

    