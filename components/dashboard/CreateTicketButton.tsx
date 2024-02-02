import Link from 'next/link';

function CreateTicketButton() {

    return (
        <Link href="dashboard/createTicket">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">crear ticket</button>
        </Link>
      );
}

export default CreateTicketButton 

    