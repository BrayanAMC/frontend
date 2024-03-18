'use client'
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"
import { GET_USERS_QUERY } from "@/apollo/queries";
import { useEffect } from "react";
import UserCard from "@/components/superAdmin/dashboard/UserCard";
import { httpLink } from "@/components/apolloConfig/apolloConfig";

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

interface UserCardProps {
    user: User;
    path: string;
}


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

    }, [refetch]);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
    return (
        <div>
            {Users.length === 0 ? (
                <p>No usuarios aún .</p>
            ) : (
                Users.map((user: User) => (
                    <UserCard user={user} path= "/superUser/dashboard/users" key={user.id} />
                ))
            )}
        </div>

    );
} 
const UsersPageComponent2 = () => (
    <ApolloProvider client={client}>
        <UsersPage />
    </ApolloProvider>
)
UsersPageComponent2.displayName = "UsersPageComponent2";
export default UsersPageComponent2;