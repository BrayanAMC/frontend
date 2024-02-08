import Link from 'next/link';

function ViewUsersButtom() {

    return (
        <Link href="dashboard/users">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Ver Usuarios</button>
        </Link>
      );
}

export default ViewUsersButtom 

    