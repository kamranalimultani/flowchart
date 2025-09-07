import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy data: example flows
type Flow = {
  id?: number;
  name: string;
  description: string;
  imageSrc: string;
};

const dummyFlows: Flow[] = [
  {
    id: 1,
    name: "User Login",
    description: "Flow handles authentication with fallback UI.",
    imageSrc: "https://via.placeholder.com/300x90?text=Login",
  },
  {
    id: 2,
    name: "Payment",
    description: "End-to-end payment integration with error retries.",
    imageSrc: "https://via.placeholder.com/300x90?text=Payment",
  },
  {
    id: 3,
    name: "Registration",
    description: "Quick signup with real-time validation and OTP.",
    imageSrc: "https://via.placeholder.com/300x90?text=Register",
  },
  {
    id: 4,
    name: "Password Reset",
    description: "Handles forgotten password recovery step by step.",
    imageSrc: "https://via.placeholder.com/300x90?text=Reset",
  },
  {
    id: 5,
    name: "Profile Update",
    description: "Lets users update their personal details securely.",
    imageSrc: "https://via.placeholder.com/300x90?text=Profile",
  },
  {
    id: 6,
    name: "Onboarding",
    description: "Guides new users with interactive tooltips.",
    imageSrc: "https://via.placeholder.com/300x90?text=Onboarding",
  },
];

// Repeat data for paging (let’s show 18 flows to demonstrate)
const flows: Flow[] = Array(3).fill(dummyFlows).flat().slice(0, 18); // total: 18 flows, demo for 3 pages

const FlowCard: React.FC<Flow> = ({ id, name, description }) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/flow/${id}`)}
      className="w-80 cursor-pointer h-56 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 rounded-xl flex flex-col justify-between"
    >
      <CardContent className="p-3  flex flex-center justify-center">
        <img
          src={
            "https://as2.ftcdn.net/jpg/04/43/44/91/1000_F_443449190_qo9SmwXwFDkLAFm3knHZaQqYccuyyn9w.jpg"
          }
          alt={name}
          className="rounded-md w-full h-30 object-cover"
        />
      </CardContent>
      <CardHeader className="bg-muted/30 rounded-t-xl p-3">
        <CardTitle className="truncate text-base font-semibold">
          {name.slice(0, 20)}
        </CardTitle>
        <CardDescription className="truncate text-sm">
          {description.slice(0, 50)}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
export const FlowList: React.FC = () => {
  const page = 1; // Static, not interactive
  const flowsPerPage = 6;
  const totalPages = Math.ceil(flows.length / flowsPerPage);
  return (
    <div className="flex flex-col items-center py-8 w-full gap-8">
      {/* Header with input and Lucide icon button */}
      <div className="items-center flex justify-between gap-2 w-full max-w-7xl mb-6">
        <div className="">
          <h1 className="text-2xl font-bold">Flow Template List</h1>
        </div>
        <div className="flex items-center gap-3">
          <Input className="w-64" placeholder="Search flows..." />
          <Button type="submit" size="icon" aria-label="Search">
            <Search />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {flows
          .slice((page - 1) * flowsPerPage, page * flowsPerPage)
          .map((flow, idx) => (
            <FlowCard key={idx} {...flow} />
          ))}
      </div>

      {/* Centered pagination, UI only */}
      <div className="flex justify-center pt-6 w-full">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={page === 1}
                tabIndex={page === 1 ? -1 : undefined}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />{" "}
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, num) => (
              <PaginationItem key={num}>
                <PaginationLink href="#" isActive={num + 1 === page}>
                  {num + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={page === totalPages}
                tabIndex={page === totalPages ? -1 : undefined}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />{" "}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
