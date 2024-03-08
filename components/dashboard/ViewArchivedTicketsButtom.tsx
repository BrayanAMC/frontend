import Link from 'next/link';

function ViewArchivedTicketsButtom() {

    return (
        <Link href="dashboard/archiveTickets">
          <button className="w-full h-full bg-[#26313c] hover:bg-red-700 text-white font-bold p-12 rounded flex items-center justify-center text-2xl shadow-lg">Ver tickets archivados</button>
        </Link>
      );
}

export default ViewArchivedTicketsButtom 

    