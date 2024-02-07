
import Link from 'next/link';

function CreateInstitutionButtom() {

    return (
        <Link href="/superUser/dashboard/createInstitution">
          <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">crear institucion</button>
        </Link>
      );
}

export default CreateInstitutionButtom 

    