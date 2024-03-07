import CreateInstitutionButtom from "@/components/superAdmin/dashboard/CreateInstitutionButtom";
import CreateUserButtom from "@/components/superAdmin/dashboard/CreateUserButtom";
import ViewInstitutionsButton from "@/components/superAdmin/dashboard/ViewInstitutionsButtom";
import ViewUsersButtom from "@/components/superAdmin/dashboard/ViewUsersButtom";
import ViewTicketsButton from "@/components/dashboard/ViewTicketsButton"


export default function Dashboard() {
  return (
    <div className=" flex flex-col justify-start min-h-screen bg-gray-100 space-y-4">
      <div className="bg-[#16202a] grid grid-cols-2 gap-4 place-items-center h-screen ">
        <ViewUsersButtom/>
        <CreateInstitutionButtom href="/admin/dashboard/createInstitution"/>
        <ViewInstitutionsButton/>
        <ViewTicketsButton />
      </div>
    </div>
  )
}