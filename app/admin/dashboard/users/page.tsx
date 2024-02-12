'use client'
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"
import { GET_USERS_QUERY } from "@/apollo/queries";
import { useEffect } from "react";
import UserCard from "@/components/superAdmin/dashboard/UserCard";

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


function UsersPage() {

    const { loading, error, data, refetch } = useQuery(GET_USERS_QUERY);
    const Users = data ? data.users : [];
    console.log("Users: ", Users);
    console.log("error: ", error);

    useEffect(() => {
        refetch();

    }, []);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
    return (
        <div>
            {Users.length === 0 ? (
                <p>No usuarios aún .</p>
            ) : (
                Users.map((user: User) => (
                    <UserCard user={user} path="/admin/dashboard/users" key={user.id} />
                ))
            )}
        </div>

    );
} export default () => (
    <ApolloProvider client={client}>
        <UsersPage />
    </ApolloProvider>
);