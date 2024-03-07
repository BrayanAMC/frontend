import Link from 'next/link';

function ViewTicketsButton() {

    return (
        <Link href="dashboard/tickets">
          <button className="w-full h-full bg-[#26313c] hover:bg-green-700 text-white font-bold p-12 rounded flex items-center justify-center text-2xl shadow-lg">Ver tickets</button>
        </Link>
      );
}

export default ViewTicketsButton 

    