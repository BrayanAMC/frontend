import Link from 'next/link';

function ViewUsersButtom() {
    return (
        <Link href="dashboard/users">
            <button className="w-full h-full bg-[#26313c] hover:bg-blue-700 text-white font-bold p-12 rounded flex items-center justify-center text-2xl shadow-lg" type='button'>
                Ver Usuarios
            </button>
        </Link>
    );
}

export default ViewUsersButtom 