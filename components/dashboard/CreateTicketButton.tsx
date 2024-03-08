import Link from 'next/link';

function CreateTicketButton() {

    return (
        <Link href="dashboard/createTicket">
          <button className="w-full h-full bg-[#26313c] hover:bg-green-700 text-white font-bold p-12 rounded flex items-center justify-center text-2xl shadow-lg">crear ticket</button>
        </Link>
      );
}

export default CreateTicketButton 

    