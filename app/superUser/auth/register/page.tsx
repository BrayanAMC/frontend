import  RegisterForm  from "@/components/auth/RegisterForm";

function Register() {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-[#16202a]">
      <div className="shadow-xl px-8 pb-8 pt-12 bg-[#26313c] rounded-xl space-y-12">
        <h1 className="font-semibold text-2xl text-white">Crea tu cuenta</h1>
        <RegisterForm />
        <div className="text-center">
          <p className="text-white">¿Ya tienes una cuenta? <a className="text-indigo-500 hover:underline" href="/auth/login">Inicia sesión</a></p>
        </div>
      </div>
    </div>
  );
}
export default Register