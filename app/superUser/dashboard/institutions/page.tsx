'use client'
import { GET_INSTITUTIONS_QUERY } from "@/apollo/queries";
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"
import { useEffect } from "react";
import InstitutionCard from "@/components/superAdmin/viewInstitutions/InstitutionCard/InstitutionCard";
import { httpLink } from "@/components/apolloConfig/apolloConfig";

interface Institution {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;

}

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
    
    }, [refetch]);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
    return (
        <div>
            {Institutions.length === 0 ? (
                <p>aún no hay instituciones.</p>
            ) : (
                Institutions.map((institution: Institution) => (
                    <InstitutionCard institution={institution} path="institutions" key={institution.id}/>
                ))
            )}
        </div>
    )
}
const InstitutionsPageComponent2 = () => (
    <ApolloProvider client={client}>
        <InstitutionsPage />
    </ApolloProvider>
)
InstitutionsPageComponent2.displayName = "InstitutionsPageComponent2";
export default InstitutionsPageComponent2;