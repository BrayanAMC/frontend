'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert,  AlertDescription, AlertTitle } from "@/components/ui/alertshad"
import { ApolloClient, InMemoryCache, createHttpLink, gql, useMutation } from "@apollo/client";
//import { Alert} from "@/components/ui/alert"
import { RECOVERY_PASSWORD_MUTATION } from "@/apollo/mutation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { httpLink } from "@/components/apolloConfig/apolloConfig";

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});


export const RecoveryPasswordForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [showAlert, setShowAlert] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(4);

    const [recoveryPassword] = useMutation(RECOVERY_PASSWORD_MUTATION, {
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
          router.push("/auth/resetpassword");
        }
      }, [showAlert, redirectCountdown, router]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Entering onSubmit");
        if (!email) {
            setError("Por favor, rellene todos los campos.");
            return;
        }
        try {
            console.log("Entering the try block");
            const input = {
                email,
            };

            console.log("before calling the api")
            const { data } = await recoveryPassword({
                variables: { recoveryPasswordInput: input },
            });
            console.log("datos de la api: ", data);
            if (data && data.recoveryPassword) {
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
            <form onSubmit={onSubmit} className="space-y-8 w-[400px]">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        id="email"
                        type="email" />
                </div>

                {error && <Alert>{error}</Alert>}
                <div className="w-full">
                    <Button className="w-full" size="lg">Enviar Correo</Button>
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
                    <AlertTitle style={{ color: 'green' }}>Codigo de recuperacion enviado!</AlertTitle>
                    <AlertDescription style={{ color: 'green' }}>
                        Se ha enviado un correo con el codigo de recuperacion a la direccion de correo electronico ingresada.
                    </AlertDescription>

                    </>
                )}
                </Alert>

            )}
            {error === null && redirectCountdown < 4 && (
                <div className="redirectionBox">
                <p>Serás redirigido a la página para cambiar contraseña en {redirectCountdown} segundos.</p>
                </div>
            )}
        </div>
    )
}