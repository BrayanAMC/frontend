/*'use client'
import { ApolloClient, InMemoryCache, createHttpLink, useMutation, ApolloProvider, useQuery } from "@apollo/client";
import { useSearchParams, useParams, ReadonlyURLSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import TicketArchivedCardSingle from "@/components/ticketCard/TicketArchivedCardSingle";

const httpLink = createHttpLink({
    uri: "http://localhost:3002/graphql",
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});
function TicketArchivedPage() {
    //datos recibidos por la url
    const { id } = useParams() || ""; //id del ticket
    const idNumber = parseInt(Array.isArray(id) ? id[0] : id, 10);//id del ticket
    const sorted = useSearchParams();
    const subject = sorted.get("subject") || "";
    const description = sorted.get("description") || "";
    const status = sorted.get("status") || "";
    const createdAt = sorted.get("createdAt") || "";
    const userId = Number(sorted.get("userId")) || 0; //id del usuario dueño del ticket


    return (
        
            <TicketArchivedCardSingle id={idNumber} subject={subject} description={description} status={status} createdAt={createdAt} userId={userId} />
        
    )

} export default TicketArchivedPage

*/
'use client'

import AdminTicketComponent from "@/components/ticketComponent/AdminTicketComponent"

function TicketPage() {
  return (
    <div>
      <AdminTicketComponent />
    </div>
  )
}export default TicketPage
