'use client';
import { ResetPasswordForm } from "../../../components/auth/ResetPasswordForm";

export default function ResetPasswordPage(){
    return (
        <div className="h-screen w-screen flex justify-center items-center bg-stone-400" >
            <div className="shadow-xl px-8 pb-8 pt-12 bg-white rounded-xl space-y-12">
            <h1 className="font-semibold text-2xl ">Cambia tu contraseña</h1>
            
            <ResetPasswordForm />
            <div className="text-center">
                <p>Volver a iniciar sesión <a className="text-indigo-500 hover:underline" href="/auth/login">Inicia sesión</a></p>
            </div>

            </div>
        </div>
    )
}