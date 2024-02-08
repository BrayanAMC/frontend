"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, createHttpLink, gql, useMutation, useQuery, ApolloProvider } from "@apollo/client";
import { Alert, AlertDescription, AlertTitle } from "../ui/alertshad";
import { useRouter } from "next/navigation";
import { REGISTER_USER_MUTATION } from "@/apollo/mutation";
import { GET_INSTITUTIONS_QUERY } from "@/apollo/queries";
import exp from "constants";


interface Institution {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;

}

const httpLink = createHttpLink({
  uri: 'http://localhost:3002/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function RegisterForm() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [institution, setInstitution] = useState("");
  const [error2, setError] = useState<string | null>(null);
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
      router.push("/superUser/dashboard");
    }
  }, [showAlert, redirectCountdown, router]);

  const { loading, error, data } = useQuery(GET_INSTITUTIONS_QUERY)
  console.log("data: ", data);






  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Entering onSubmit");
    if (!firstName || !lastName || !email || !password) {
      setError("Por favor, rellene todos los campos.");
      return;
    }
    try {
      const institutionId = parseInt(institution);
      console.log("Entering the try block");
      const input = {
        firstName,
        lastName,
        email,
        password,
        role,
        institutionId
      };
      console.log("before calling the api")
      console.log("institution before calling the api: ", institution)
      const { data, errors } = await registerUser({
        variables: { createUserInput: input },
      });
      console.log("datos de la api: ", data);
      console.log("errores de la api: ", errors);

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
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="role">Rol</Label>
          <select
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            id="role"
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="institution">Institución</Label>
          <select
            required
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            id="institution"
          >
            {loading ? (
              <option>Cargando...</option>
            ) : error ? (
              <option>Error</option>
            ) : (
              data.institutions.map((institution: Institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="w-full">
          <Button type="submit" className="w-full" size="lg">
            Registrarse
          </Button>

        </div>
      </form>
      {showAlert && (
        <Alert variant="default">
          {error2 ? (
            <>
              <AlertTitle style={{ color: 'red' }}>Error</AlertTitle>
              <AlertDescription style={{ color: 'red' }}>{error2}</AlertDescription>
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
      {error2 === null && redirectCountdown < 4 && (
        <div className="redirectionBox">
          <p>Serás redirigido a la página de login en {redirectCountdown} segundos.</p>
        </div>
      )}
    </div>

  );
} export default () => (
  <ApolloProvider client={client}>
    <RegisterForm />
  </ApolloProvider>
);
