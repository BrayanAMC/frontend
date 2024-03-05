'use client'
import { GET_INSTITUTIONS_QUERY } from "@/apollo/queries";
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"
import InstitutionCard from "@/components/superAdmin/viewInstitutions/InstitutionCard/InstitutionCard";
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';

interface Institution {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;

}

const columns =[
    {name: 'ID', selector: (row: Institution) => row.id, sortable: true},
    {name: 'Name', selector: (row: Institution) => row.name, sortable: true},
    {name: 'Email', selector: (row: Institution) => row.email, sortable: true},
    {name: 'Phone Number', selector: (row: Institution) => row.phoneNumber, sortable: true},
]

const httpLink = createHttpLink({
    uri: 'http://localhost:3002/graphql',
});
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});




function InstitutionsPage(){
    const [searchValue, setSearchValue] = useState('');
    //console.log("antes de llamar a la query")
    const { loading, error, data, refetch } = useQuery(GET_INSTITUTIONS_QUERY);
    const Institutions = data ? data.institutions : [];
    console.log("Institutions: ",Institutions);

    useEffect(() => {
        refetch();
    
    }, []);

    const filteredInstitutions = Institutions.filter((institution: Institution) => {
        if (searchValue && !(institution.name.includes(searchValue) || institution.email.includes(searchValue) || institution.phoneNumber.includes(searchValue))) {
            return false;
        }
        return true;
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
    return (
        <div>
            <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
            {filteredInstitutions.length === 0 ? (
                <p>Usted no tiene tickets aún.</p>
            ) : (
                <DataTable
                    title="Institutions"
                    columns={columns}
                    data={filteredInstitutions}
                    pagination
                    onRowClicked={row => {
                        const query = new URLSearchParams({
                            name: row.name,
                            email: row.email,
                            phoneNumber: row.phoneNumber,

                        }).toString();

                        window.location.href = `/admin/dashboard/institutions/${row.id}?${query}`;
                    }}
                />
            )}
        </div>
    )
}export default () => (
    <ApolloProvider client={client}>
        <InstitutionsPage />
    </ApolloProvider>
);
