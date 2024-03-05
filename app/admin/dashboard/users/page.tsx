'use client'
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"
import { GET_INSTITUTIONS_QUERY, GET_USERS_QUERY } from "@/apollo/queries";
import UserCard from "@/components/superAdmin/dashboard/UserCard";
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';

export enum RoleStatus {
    ADMIN = "admin",
    SUPER_ADMIN = "superadmin",
    USER = "user",
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accessToken: string;
    recoveryPasswordToken: string;
    role: string;
    institutionId?: number;
}

const httpLink = createHttpLink({
    uri: 'http://localhost:3002/graphql',
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

interface Institution {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;

}

const columns = [
    { name: 'ID', selector: (row: User) => row.id, sortable: true },
    { name: 'First Name', selector: (row: User) => row.firstName, sortable: true },
    { name: 'Last Name', selector: (row: User) => row.lastName, sortable: true },
    { name: 'Email', selector: (row: User) => row.email, sortable: true },
    { name: 'Role', selector: (row: User) => row.role, sortable: true },
]




function UsersPage() {

    const [institutionFilter, setInstitutionFilter] = useState(0);
    const [roleFilter, setRoleFilter] = useState<RoleStatus | null>(null);

    const { loading, error, data, refetch } = useQuery(GET_USERS_QUERY);
    const Users = data ? data.users : [];
    
    const filteredUsers = Users.filter((user: User) => {

        if (institutionFilter && user.institutionId !== institutionFilter) {
            return false;
        
        }
        if (roleFilter && user.role !== roleFilter) {
            return false;
        }
        return true;
    });

    const { loading: loadingInstitutions, error: errorInstitutions, data: dataInstitutions } = useQuery(GET_INSTITUTIONS_QUERY, {
        onCompleted: (data) => {
            // Set the initial institution value to the ID of the first institution

        },
    });

    useEffect(() => {
        refetch();

    }, []);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
    return (
        <div>
            <select value={roleFilter || ''} onChange={e => setRoleFilter(e.target.value as RoleStatus)}>
                <option value={''}>All Roles</option>
                <option value={RoleStatus.ADMIN}>Admin</option>
                <option value={RoleStatus.SUPER_ADMIN}>Super Admin</option>
                <option value={RoleStatus.USER}>User</option>
            </select>    
            <select value={institutionFilter} onChange={e => setInstitutionFilter(+e.target.value)}>
                <option value={0}>All Institutions</option>
                {dataInstitutions?.institutions?.map((institution: Institution) => (
                    <option value={institution.id}>{institution.name}</option>
                ))}
            </select>
            
            {filteredUsers.length === 0 ? (
                <p>No hay coincidencias</p>
            ) : (
                <DataTable
                    title="Users"
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    onRowClicked={row => {
                        const query = new URLSearchParams({
                            firstName: row.firstName,
                            lastName: row.lastName,
                            email: row.email,
                            role: row.role,
                            institutionId: String(row.institutionId)
                        }).toString();

                        window.location.href = `/admin/dashboard/users/${row.id}?${query}`;
                    }}
                />
            )}
        </div>

    );
} export default () => (
    <ApolloProvider client={client}>
        <UsersPage />
    </ApolloProvider>
);
//"/admin/dashboard/users"