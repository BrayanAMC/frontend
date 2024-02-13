import Link from 'next/link';

function ViewTicketsButton() {

    return (
        <Link href="dashboard/tickets">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Ver tickets</button>
        </Link>
      );
}

export default ViewTicketsButton 

    