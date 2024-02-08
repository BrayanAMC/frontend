import Link from 'next/link';

function ViewInstitutionsButton() {

    return (
        <Link href="dashboard/institutions">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Ver instituciones</button>
        </Link>
      );
}

export default ViewInstitutionsButton 

    