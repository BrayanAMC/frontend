'use client';

import { LOGIN_USER_MUTATION } from "@/apollo/mutation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alertshad"
import { useState } from "react"
import Link from 'next/link'
import { ApolloClient, InMemoryCache, createHttpLink, useMutation } from "@apollo/client"

const httpLink = createHttpLink({
    uri: 'http://localhost:3002/graphql',
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

export default function LoginForm() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<string | null>(null)
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
          const { data } = await loginUser({
            variables: { loginUserInput: input },
          });
          console.log("datos de la api: ", data);
          if (data && data.login) {
            setShowAlert(true);
            localStorage.setItem('idUser', data.login.id);
            localStorage.setItem('tokenUser', data.login.accessToken);//para solicitudes subsiguientes.
            localStorage.setItem('emailUser', data.login.email);
            localStorage.setItem('firstNameUser', data.login.firstName);
            localStorage.setItem('lastNameUser', data.login.lastName);
            localStorage.setItem('isUserLoggedIn', 'true');
            localStorage.setItem('isAdmin', 'false');
            localStorage.removeItem("cart");
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
    <div className="space-y-8 w-[400px]">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
          />
        </div>
        <p className="text-center">
          ¿Olvidaste tu contraseña?{" "}
          <Link
            className="text-indigo-500 hover:underline"
            href="./resetpassword"
          >
            Recupérala
          </Link>{" "}
        </p>
        <div className="w-full">
          <Button className="w-full" size="lg">
            Ingresar
          </Button>
        </div>
      </form>
      {showAlert && (
        <Alert variant="default">
          {error ? (
            <>
              <AlertTitle style={{ color: 'red' }}>Error</AlertTitle>
              <AlertDescription style={{ color: 'red' }}>{error}</AlertDescription>
            </>
          ) : (
            <>
              <AlertTitle style={{ color: 'green' }}>Datos ingresados correctamente</AlertTitle>
              <AlertDescription style={{ color: 'green' }}>
                Ha ingresado exitosamente.
              </AlertDescription>

            </>
          )}
        </Alert>

      )}
    </div>
  );
}