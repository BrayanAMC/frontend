import Link from 'next/link';

function ViewArchivedTicketsButtom() {

    return (
        <Link href="dashboard/archiveTickets">
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Ver tickets archivados</button>
        </Link>
      );
}

export default ViewArchivedTicketsButtom 

    