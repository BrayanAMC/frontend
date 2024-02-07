import Link from 'next/link';

function CreateUserButtom() {

    return (
        <Link href="/superUser/auth/register">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">crear usuario</button>
        </Link>
      );
}

export default CreateUserButtom 

    