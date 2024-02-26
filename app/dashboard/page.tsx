import ViewTicketsButton from "@/components/dashboard/ViewTicketsButton"
import CreateTicketButton from "@/components/dashboard/CreateTicketButton"
import ViewArchivedTicketsButtom from "@/components/dashboard/ViewArchivedTicketsButtom"

export default function Dashboard() {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 space-y-4 ">
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 space-y-4 mt-20">
        <ViewTicketsButton />
        <CreateTicketButton />
        <ViewArchivedTicketsButtom />
        </div>

      </div>
    )
  }