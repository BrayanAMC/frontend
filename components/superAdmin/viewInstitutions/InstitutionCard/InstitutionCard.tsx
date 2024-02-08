'use client'
import Link from "next/link";
import Image from "next/image";
import institutionImage from '@/img/institution.png'

interface Institution {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;

}

function InstitutionCard({ institution }: { institution: Institution }) {
    return (
        <div className="m-6 flex justify-center">
            <Link href={{
                //envio a ruta dinamica
                pathname: `/superUser/dashboard/institutions/${institution.id}`, query: {
                    name: institution.name,
                    email: institution.email,
                    phoneNumber: institution.phoneNumber
                }
            }}
                className="max-w-md bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className=" w-120 h-64 md:flex ">
                    <div className=" w-40 p-3 md:flex-shrink-0">
                        <Image className="h-48 w-full object-cover md:w-48" src={institutionImage} alt="institution" />
                    </div>
                    <div className=" w-80 p-8">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Institution #{institution.id}</div>
                        <p className="block mt-1 text-lg leading-tight font-medium text-black line-clamp-1">{institution.name}</p>
                        <p className="mt-2 text-gray-500 line-clamp-1">{institution.email}</p>
                        <p className="mt-2 text-gray-500 line-clamp-1">{institution.phoneNumber}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
    
}
export default InstitutionCard;