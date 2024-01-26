"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, createHttpLink, gql, useMutation } from "@apollo/client";
import { Alert, AlertDescription, AlertTitle } from "../ui/alertshad";
import { useRouter } from "next/navigation";
import { REGISTER_USER_MUTATION } from "@/apollo/mutation";

const httpLink = createHttpLink({
  uri: 'http://localhost:3002/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export const RegisterForm = () => {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(4);

  const [registerUser] = useMutation(REGISTER_USER_MUTATION, {
    client, 
  });

  useEffect(() => {
    // This effect will run when showAlert changes
    if (showAlert && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    } else if (showAlert && redirectCountdown === 0) {
      // Redirect when countdown reaches 0
      router.push("/auth/login");
    }
  }, [showAlert, redirectCountdown, router]);


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Entering onSubmit");
    if (!firstName || !lastName || !email || !password) {
      setError("Por favor, rellene todos los campos.");
      return;
    }
    try {
      console.log("Entering the try block");
      const input = {
        firstName,
        lastName,
        email,
        password,
      };
      console.log("before calling the api")
      const { data } = await registerUser({
        variables: { createUserInput: input },
      });
      console.log("datos de la api: ", data);

      if (data && data.createUser) {
        setShowAlert(true);

      } else {
        setError("La registración falló.");
        setShowAlert(true);
      }
    } catch (error) {
      setError("Hubo un error grave.");
      setShowAlert(true);
    }
  };
  return (
    <div className="space-y-8 w-[400px]">

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            id="firstName"
            type="text"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            id="lastName"
            type="text"
          />
        </div>
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
        <div className="w-full">
          <Button type="submit" className="w-full" size="lg">
            Registrarse
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
              <AlertTitle style={{ color: 'green' }}>Registro Exitoso</AlertTitle>
              <AlertDescription style={{ color: 'green' }}>
                Tu registro se ha completado con éxito.
              </AlertDescription>

            </>
          )}
        </Alert>

      )}
      {error === null && redirectCountdown < 4 && (
        <div className="redirectionBox">
          <p>Serás redirigido a la página de login en {redirectCountdown} segundos.</p>
        </div>
      )}
    </div>

  );
};
