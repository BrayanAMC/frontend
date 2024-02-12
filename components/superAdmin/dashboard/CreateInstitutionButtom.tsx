
import Link from 'next/link';

interface CreateInstitutionButtomProps {
  href: string;
}

const CreateInstitutionButtom: React.FC<CreateInstitutionButtomProps> = ({ href }) => {
  return (
      <Link href={href}>
        <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">crear institucion</button>
      </Link>
    );
}

export default CreateInstitutionButtom 

    