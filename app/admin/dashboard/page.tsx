'use client';
import React, { useEffect, useState } from 'react';
import { GET_INSTITUTION_QUERY } from '@/apollo/queries';
import CreateInstitutionButtom from "@/components/superAdmin/dashboard/CreateInstitutionButtom";
import CreateUserButtom from "@/components/superAdmin/dashboard/CreateUserButtom";
import ViewInstitutionsButton from "@/components/superAdmin/dashboard/ViewInstitutionsButtom";
import ViewUsersButtom from "@/components/superAdmin/dashboard/ViewUsersButtom";
import ViewTicketsButton from "@/components/dashboard/ViewTicketsButton"
import { ApolloClient, InMemoryCache, createHttpLink, useQuery, ApolloProvider } from "@apollo/client"



function Dashboard() {
  const [firstNameUser, setFirstNameUser] = useState('');
  const [lastNameUser, setLastNameUser] = useState('');
  const [userRole, setUserRole] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  
  

  useEffect(() => {
    setFirstNameUser(localStorage.getItem('firstNameUser') || '');
    setLastNameUser(localStorage.getItem('lastNameUser') || '');
    setUserRole(localStorage.getItem('userRole') || '');
    setEmailUser(localStorage.getItem('emailUser') || '');
    
  }, []);
  
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
            
          </div>
        </div>
        <div className="relative hidden md:block bg-[#8493A8]">
          <div className="grid grid-cols-2 gap-4 place-items-center h-screen ">
            <ViewUsersButtom/>
            <CreateInstitutionButtom href="/admin/dashboard/createInstitution"/>
            <ViewInstitutionsButton/>
            <ViewTicketsButton />
          </div>
        </div>
      </div>
    </main>
  )
}export default Dashboard
