'use client'
import { GET_INSTITUTIONS_QUERY } from "@/apollo/queries";
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"
import { useEffect } from "react";
import InstitutionCard from "@/components/superAdmin/viewInstitutions/InstitutionCard/InstitutionCard";

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




function InstitutionsPage(){
    console.log("antes de llamar a la query")
    const { loading, error, data, refetch } = useQuery(GET_INSTITUTIONS_QUERY);
    const Institutions = data ? data.institutions : [];
    console.log("Institutions: ",Institutions);

    useEffect(() => {
        refetch();
    
    }, []);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
    return (
        <div>
            {Institutions.length === 0 ? (
                <p>aún no hay instituciones.</p>
            ) : (
                Institutions.map((institution: Institution) => (
                    <InstitutionCard institution={institution} path="/admin/dashboard/institutions" key={institution.id}/>
                ))
            )}
        </div>
    )
}export default () => (
    <ApolloProvider client={client}>
        <InstitutionsPage />
    </ApolloProvider>
);