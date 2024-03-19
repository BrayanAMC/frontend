'use client';

import { LOGIN_USER_MUTATION } from "@/apollo/mutation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alertshad"
import { useState } from "react"
import Link from 'next/link'
import { ApolloClient, InMemoryCache, createHttpLink, useMutation } from "@apollo/client"
import { setContext } from '@apollo/client/link/context';
import Image from 'next/image';
import vicuna04 from '@/img/vicuna04.jpg'
import { httpLink } from "@/components/apolloConfig/apolloConfig";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('tokenUser');
  console.log("token del user storage: ", token);
  console.log("GATEWAY_DOMAIN: ",process.env.NEXT_PUBLIC_GATEWAY_DOMAIN)
  const authHeaders = {
    ...headers,
    authorization: token ? `Bearer ${token}` : "",
  }
  console.log("Headers after authLink: ", authHeaders);
  return {
    headers: authHeaders
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function LoginForm() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const dummyToken = 'dummyToken'
  const [loginUser] = useMutation(LOGIN_USER_MUTATION, {
    client,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowAlert(true);
    console.log("Entering onSubmit");
    if (!email || !password) {
      setError("Por favor, rellene todos los campos.");
      return;
    }
    try {
      console.log("Entering the try block");
      if (email === "admin@admin.com" && password === "admin") {
        localStorage.setItem('isUserLoggedIn', 'true');
        localStorage.setItem('isAdmin', 'true');
        window.location.href = "/";
      } else {
        const input = {
          email,
          password,
        };
        //llamada a la api
        console.log(client);
        const { data } = await loginUser({
          variables: { loginUserInput: input },
        });
        console.log("datos de la api: ", data);
        if (data && data.login) {
          setShowAlert(true);
          localStorage.setItem('idUser', data.login.id);
          localStorage.setItem('tokenUser', data.login.accessToken);//para solicitudes subsiguientes.
          //localStorage.setItem('tokenUser', dummyToken);//para solicitudes subsiguientes.
          localStorage.setItem('emailUser', data.login.email);
          localStorage.setItem('firstNameUser', data.login.firstName);
          localStorage.setItem('lastNameUser', data.login.lastName);
          localStorage.setItem('userRole', data.login.role);
          localStorage.setItem('isUserLoggedIn', 'true');
          localStorage.setItem('institutionId', data.login.institutionId)
          //localStorage.setItem('isAdmin', 'false');
          localStorage.removeItem("cart");
          if (data.login.role === "superadmin") {
            //localStorage.setItem('isSuperAdmin', 'true');
            //localStorage.setItem('isAdmin', 'false');
            window.location.href = "/superUser/dashboard"
          }
          if (data.login.role === "admin") {
            //localStorage.setItem('isAdmin', 'true');
            //localStorage.setItem('isSuperAdmin', 'false');
            window.location.href = "/admin/dashboard"
          }
          if (data.login.role === "user") {
            //localStorage.setItem('isAdmin', 'false');
            //localStorage.setItem('isSuperAdmin', 'false');
            window.location.href = "/dashboard"
          }
          //window.location.href = "/dashboard";
        } else {
          setError("Credenciales inválidas.");
          setShowAlert(true);
        }
      }
    }
    catch (error) {
      console.error('error: ', error);
      setError('Credenciales inválidas.');
      setShowAlert(true);
    }

  }
  return (
    <main className="bg-[#26313c] h-screen flex items-center justify-center p-10">
      <div className="grid w-full h-full grid-cols-1 bg-white box-anim md:grid-cols-2">
        <div className="bg-[#16202a] text-white flex items-center justify-center flex-col">
          <div className="my-4">
            <h1 className="text-3xl font-semibold ">Login</h1>
            <p className="mt-2 text-xs text-slate-400">
              See Your Growth and get consulting growth
            </p>
          </div>
          <form onSubmit={onSubmit}>

            <Label htmlFor="email">Email*</Label>
            <Input
              className="mt-2 mb-4 bg-transparent rounded-full"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="Email"
            />
            <Label htmlFor="password">Password*</Label>
            <Input
              className="mt-2 bg-transparent rounded-full"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="password"
            />

            <Button
              type="submit"
              className="w-full mt-6 bg-indigo-600 rounded-full hover:bg-indigo-700"
            >
              Login
            </Button>
            <p className="text-center mt-2" >
              ¿Olvidaste tu contraseña?{" "}
              <Link
                className="text-indigo-500 hover:underline"
                href="./recoverypassword"
              >
                Recupérala
              </Link>{" "}
            </p>

          </form>
          <p className="mt-4 text-xs text-slate-200">
            @2023 All rights reserved
          </p>
        </div>
        <div className="relative hidden md:block">
        <div className="absolute top-0 left-0 w-full h-full object-cover">
        <Image className="object-cover" src={vicuna04} alt="vicuna" width={1080} height={1080} priority />
        </div>
        </div>
      </div>
    </main>
  );
}