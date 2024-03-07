
import Link from 'next/link';

interface CreateInstitutionButtomProps {
  href: string;
}

const CreateInstitutionButtom: React.FC<CreateInstitutionButtomProps> = ({ href }) => {
  return (
      <Link href={href}>
        <button className="w-full h-full bg-[#26313c] hover:bg-orange-700 text-white font-bold p-12 rounded flex items-center justify-center text-2xl shadow-lg">crear institucion</button>
      </Link>
    );
}

export default CreateInstitutionButtom 

    