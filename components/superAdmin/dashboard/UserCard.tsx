'use client'
import Link from "next/link";
import Image from "next/image";
import UserImage from '@/img/user.png'
interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accessToken: string;
    recoveryPasswordToken: string;
    role: string;
    institutionId?: number;
}

interface UserCardProps {
    user: User;
    path: string;
}

function UserCard({user, path}: UserCardProps){
    return(
        <div className="m-6 flex justify-center">
            <Link href={{
                //envio a ruta dinamica
                pathname: `${path}/${user.id}`, query: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password,
                    accessToken: user.accessToken,
                    recoveryPasswordToken: user.recoveryPasswordToken,
                    role: user.role,
                    institutionId: user.institutionId
                }
            }}
                className="max-w-md bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className=" w-120 h-64 md:flex ">
                    <div className=" w-40 p-3 md:flex-shrink-0">
                        <Image className="h-48 w-full object-cover md:w-48" src={UserImage} alt="user" />
                    </div>
                    <div className=" w-80 p-8">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">User #{user.id}</div>
                        <p className="block mt-1 text-lg leading-tight font-medium text-black line-clamp-1">{user.firstName} {user.lastName}</p>
                        <p className="mt-2 text-gray-500 line-clamp-1">{user.email}</p>
                        <p className="mt-2 text-gray-500 line-clamp-1">{user.role}</p>
                    </div>
                </div>
            </Link>
        </div>
        
    )

}export default UserCard;