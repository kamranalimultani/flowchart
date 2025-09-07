import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Trash2, Plus } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { getRequest, deleteRequest } from "@/utils/apiUtils"; // 👈 assuming you already have these

type Item = {
  id: number;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form_data: any;
  created_at: string;
};

export const FormTemplates: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(6);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // fetch data
  const fetchTemplates = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await getRequest(
        `/api/form-templates?page=${pageNum}&per_page=${perPage}`
      );
      setItems(res.data);
      setTotalPages(res.last_page);
      setPage(res.current_page);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates(page);
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      await deleteRequest(`/api/form-templates/${id}`);
      fetchTemplates(page); // reload current page
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="mx-4 mb-4">
      <div className="flex my-4 justify-between">
        <h1 className="mb-4 text-2xl font-bold">Form Templates</h1>
        <Button
          className="cursor-pointer"
          onClick={() => navigate("/add-form-template")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Template
        </Button>
      </div>

      {/* Table container */}
      <div className="w-full mx-auto rounded-2xl shadow-md border p-6 mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-left">Title</TableHead>
              <TableHead className="font-semibold text-left">Created</TableHead>
              <TableHead className="font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  No templates found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} className="transition-colors">
                  <TableCell className="text-left">{item.title}</TableCell>
                  <TableCell className="text-left">
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="cursor-pointer"
                        aria-label="Edit"
                        onClick={() => [
                          console.log(item),
                          navigate("/add-form-template", {
                            state: { form: item },
                          }),
                        ]}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="cursor-pointer"
                        variant="ghost"
                        aria-label="View"
                        onClick={() => navigate(`/form-template/${item.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        className="cursor-pointer"
                        size="icon"
                        variant="ghost"
                        aria-label="Delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center w-full">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, num) => (
                <PaginationItem key={num}>
                  <PaginationLink
                    href="#"
                    isActive={num + 1 === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(num + 1);
                    }}
                  >
                    {num + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
