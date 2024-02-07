import CreateInstitutionButtom from "@/components/superAdmin/dashboard/CreateInstitutionButtom";
import CreateUserButtom from "@/components/superAdmin/dashboard/CreateUserButtom";


export default function Dashboard() {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 space-y-4 ">
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 space-y-4 mt-20">
        
        <CreateUserButtom/>
        <CreateInstitutionButtom/>
        </div>

      </div>
    )
  }