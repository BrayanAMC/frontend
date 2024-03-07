import Link from 'next/link';

function ViewInstitutionsButton() {

    return (
        <Link href="dashboard/institutions">
          <button className="w-full h-full bg-[#26313c] hover:bg-orange-700 text-white font-bold p-12 rounded flex items-center justify-center text-2xl shadow-lg">Ver instituciones</button>
        </Link>
      );
}

export default ViewInstitutionsButton 

    