'use client';
import ViewTicketsButton from "@/components/dashboard/ViewTicketsButton"
import CreateTicketButton from "@/components/dashboard/CreateTicketButton"
import ViewArchivedTicketsButtom from "@/components/dashboard/ViewArchivedTicketsButtom"
import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"
import { GET_INSTITUTION_QUERY } from '@/apollo/queries';
import { httpLink } from "@/components/apolloConfig/apolloConfig";

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function Dashboard() {

  const [firstNameUser, setFirstNameUser] = useState('');
  const [lastNameUser, setLastNameUser] = useState('');
  const [userRole, setUserRole] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const institutionIdInt = parseInt(institutionId);
  console.log("imprimiendo institutionIdInt: ", institutionIdInt);

  useEffect(() => {
    setFirstNameUser(localStorage.getItem('firstNameUser') || '');
    setLastNameUser(localStorage.getItem('lastNameUser') || '');
    setUserRole(localStorage.getItem('userRole') || '');
    setEmailUser(localStorage.getItem('emailUser') || '');
    setInstitutionId(localStorage.getItem('institutionId') || '');
  }, []);

  const { loading, error, data } = useQuery(GET_INSTITUTION_QUERY,{
    variables: { id: institutionIdInt }
  });

  const institution = data?.institution || {};

  console.log("imprimiendo institution: ", institution);

  if (loading) return <p>Loading...</p>;
  /*
  <ViewTicketsButton />
        <CreateTicketButton />
        <ViewArchivedTicketsButtom />
        */
  
    return (
      <main className="bg-[#26313c] h-screen flex items-center justify-center p-10">
      <div className="grid w-full h-full grid-cols-1 bg-white box-anim md:grid-cols-2">
        <div className="bg-[#16202a] text-white flex flex-col justify-center items-center ">
          {/* <div className="bg-[#16202a] text-white flex flex-col justify-start items-center mb-auto">*/}
          <div className="my-4 ">
            <h1 className="text-3xl font-semibold ">User Information</h1>
            <p className="mt-2 text-xs text-slate-400">
              Name: {firstNameUser}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              LastName: {lastNameUser}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Email: {emailUser}
            </p>  
            <p className="mt-2 text-xs text-slate-400">
              Role: {userRole}
            </p>
            {institutionId != "null" && 
              <p className="mt-2 text-xs text-slate-400">
                Institution: {institution.name}
              </p>
            }
          </div>
        </div>
        <div className="relative hidden md:block bg-[#8493A8]">
          <div className="grid grid-cols-2 gap-4 place-items-center h-screen ">
            <ViewTicketsButton/>
            <CreateTicketButton/>
            <ViewArchivedTicketsButtom />
          </div>
        </div>
      </div>
    </main>
    )
  }
  const DashboardComponent = () => (
    <ApolloProvider client={client}>
      <Dashboard />
    </ApolloProvider>
  );
  DashboardComponent.displayName = 'DashboardComponent';
  export default DashboardComponent;
  