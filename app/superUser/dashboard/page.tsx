import CreateInstitutionButtom from "@/components/superAdmin/dashboard/CreateInstitutionButtom";
import CreateUserButtom from "@/components/superAdmin/dashboard/CreateUserButtom";
import ViewInstitutionsButton from "@/components/superAdmin/dashboard/ViewInstitutionsButtom";
import ViewUsersButtom from "@/components/superAdmin/dashboard/ViewUsersButtom";


export default function Dashboard() {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-[#16202a] space-y-4 ">
        <div className="flex flex-col items-center justify-start min-h-screen bg-[#16202a] space-y-4 mt-20">
        
        <CreateUserButtom/>
        <ViewUsersButtom/>
        <CreateInstitutionButtom href="/superUser/dashboard/createInstitution"/>
        <ViewInstitutionsButton/>
        </div>

      </div>
    )
  }