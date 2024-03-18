'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alertshad"
import { ApolloClient, InMemoryCache, createHttpLink, gql, useMutation } from "@apollo/client";
//import { Alert} from "@/components/ui/alert"
import { CHANGE_PASSWORD_MUTATION } from "@/apollo/mutation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from 'next/link'
import { httpLink } from "@/components/apolloConfig/apolloConfig";

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export const ResetPasswordForm = () => {

  const router = useRouter();
  const [recoveryPasswordCode, setRecoveryPasswordCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(4);

  const [changePassword] = useMutation(CHANGE_PASSWORD_MUTATION, {
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
    e.preventDefault()
    console.log("Entering onSubmit");
    if (!recoveryPasswordCode || !newPassword || !confirmNewPassword) {
      setError("Por favor, rellene todos los campos.");
      return;
    }
    try {
      console.log("Entering the try block");
      const input = {
        recoveryPasswordCode,
        newPassword,
        confirmNewPassword
      };

      console.log("before calling the api")
      const { data } = await changePassword({
        variables: { changePasswordInput: input },
      });
      console.log("datos de la api: ", data);
      if (data && data.changePassword) {
        setShowAlert(true);

      } else {
        setError("No se pudo enviar el codigo para resetear la contraseña.");
        setShowAlert(true);
      }

    }
    catch (error) {
      setError("Hubo un error grave.");
      setShowAlert(true);
    }
  }




  return (
    <div className="space-y-8 w-[400px]">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Codigo de recuperación</Label>
          <Input
            required
            value={recoveryPasswordCode}
            onChange={(e) => setRecoveryPasswordCode(e.target.value)}
            id="input"
            type="input"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="password">Nueva contraseña</Label>
          <Input
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            id="password"
            type="password"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="password">Repita nueva contraseña</Label>
          <Input
            required
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            id="confirmNewPassword"
            type="password"
          />
        </div>
        <p className="text-center">
          ¿Olvidaste tu contraseña?{" "}
          <Link
            className="text-indigo-500 hover:underline"
            href="./recoverypassword"
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
                Se ha actualizado la contraseña exitosamente.
              </AlertDescription>

            </>
          )}
        </Alert>

      )}
      {error === null && redirectCountdown < 4 && (
                <div className="redirectionBox">
                <p>Serás redirigido a inicio de sesión en {redirectCountdown} segundos.</p>
                </div>
            )}
    </div>
  );
}