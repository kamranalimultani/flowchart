/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Edit, Eye, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/utils/apiUtils";
import { FlowPreview } from "@/components/FlowPreview";
import { useNavigate } from "react-router-dom";

// Dummy data: example flows
type Flow = {
  id?: number;
  title: string;
  xml?: string; // backend returns this
  description?: string;
};
type FlowCardProps = Flow & {
  refreshFlows: () => void; // added
};

const FlowCard: React.FC<FlowCardProps> = ({
  id,
  title,
  xml,
  description,
  refreshFlows,
}) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [editorWindow, setEditorWindow] = useState<Window | null>(null);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteFlow = async (id: number) => {
    try {
      await deleteRequest(`/api/flows/${id}`);
      // Remove deleted flow from state
      refreshFlows();
    } catch (err) {
      console.error("Error deleting flow:", err);
    }
  };

  const updateFlowXml = async (id: number, xml: string) => {
    try {
      const response = await putRequest(`/api/flows/${id}`, { xml });
      return response;
    } catch (err) {
      console.error("Error updating flow XML:", err);
      throw err;
    }
  };

  const handleMessage = async (event: MessageEvent) => {
    // Fetch necessary details to continue
    if (id) {
      if (event.origin !== "https://embed.diagrams.net") return;
      if (event.data === "ready" && editorWindow) {
        // const svgContent = await getSvgContent(selectedDiagram);
        if (svgContent) {
          editorWindow.postMessage(svgContent, "*");
        }
      }
    }

    if (
      event.data &&
      typeof event.data === "string" &&
      event.data.startsWith("<mxfile") &&
      id
    ) {
      await updateFlowXml(id, event.data);
      // await update(obj);
      if (editorWindow) {
        editorWindow.close();
        setEditorWindow(null);
      }
    }
  };

  useEffect(() => {
    // Only proceed when editorWindow, selectedDiagram is available
    if (editorWindow) {
      window.addEventListener("message", handleMessage);
    }
    refreshFlows();
    return () => {
      window.removeEventListener("message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorWindow, id]);

  const handleEditDiagram = async (e: React.MouseEvent, diagram: Flow) => {
    e.stopPropagation();
    const svgContent = diagram.xml;

    if (svgContent && svgContent.length > 0) {
      const newEditorWindow = window.open(
        `https://embed.diagrams.net?embed=1&spin=1&libraries=1&ui=light&noExitBtn=1`,
        "MxGraph Editor",
        "width=1280,height=720"
      );

      if (newEditorWindow) {
        setSvgContent(svgContent);
        newEditorWindow.postMessage(svgContent, "*");
        setEditorWindow(newEditorWindow);
      } else {
        console.log("object");
      }
    }
  };

  return (
    <>
      <Card className="relative group w-80 h-56 shadow-md hover:shadow-lg transition-all rounded-xl flex flex-col justify-between overflow-hidden">
        {/* Preview */}
        <CardContent className="p-3 flex flex-center justify-center h-[30%]">
          <FlowPreview xml={xml} containerId={`preview-${id}`} />
        </CardContent>

        {/* Info */}
        <CardHeader className="bg-muted/30 rounded-t-xl p-3">
          <CardTitle className="truncate text-base font-semibold">
            {title}
          </CardTitle>
          <CardDescription className="truncate text-sm">
            {description}
          </CardDescription>
        </CardHeader>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/flow/${id}`, {
                state: { id, title, description, xml },
              });
            }}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
          >
            <Eye
              color="green"
              className="w-5 h-5 text-gray-700 cursor-pointer"
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditDiagram(e, { id, title, description, xml });
            }}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
          >
            <Edit className="w-5 h-5 text-gray-700 cursor-pointer" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();

              setShowDeleteModal(true); // TODO: handle delete flow
            }}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
          >
            <Trash2 className="w-5 h-5 text-red-600 cursor-pointer" />
          </button>
        </div>
      </Card>
      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Flow</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this flow?</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (id !== undefined) deleteFlow(id);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const FlowList: React.FC = () => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [page, setPage] = useState(1);
  const flowsPerPage = 6;
  const totalPages = Math.ceil(flows.length / flowsPerPage);

  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [tab, setTab] = useState("custom");
  const fetchFlows = async () => {
    try {
      const res = await getRequest("/api/flows"); // Laravel: GET /api/flows
      setFlows(res || []);
    } catch (err) {
      console.error("Error fetching flows:", err);
    }
  };
  // Fetch flows from API
  useEffect(() => {
    fetchFlows();
  }, []);

  // Save / Upload flow
  const handleSaveFlow = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", tab);
      formData.append("description", description);

      if (tab === "upload" && file) {
        formData.append("file", file);
      }

      await postRequest("/api/flows", formData);
      setOpenModal(false);
      setTitle("");
      setFile(null);

      // Refresh flows
      const res = await getRequest("/api/flows");
      setFlows(res || []);
    } catch (err) {
      console.error("Error creating flow:", err);
    }
  };

  return (
    <div className="flex flex-col items-center py-8 w-full gap-8">
      {/* Header */}
      <div className="items-center flex justify-between gap-2 w-full max-w-7xl mb-6">
        <h1 className="text-2xl font-bold">Flow Template List</h1>
        <div className="flex items-center gap-3">
          <Input className="w-64" placeholder="Search flows..." />
          <Button type="submit" size="icon">
            <Search />
          </Button>
          <Button onClick={() => setOpenModal(true)}>Create Flow</Button>
        </div>
      </div>

      {/* Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {flows.map((flow) => (
          <FlowCard key={flow.id} {...flow} refreshFlows={fetchFlows} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center pt-6 w-full">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, num) => (
              <PaginationItem key={num}>
                <PaginationLink
                  href="#"
                  isActive={num + 1 === page}
                  onClick={() => setPage(num + 1)}
                >
                  {num + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create a Flow</DialogTitle>
          </DialogHeader>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            {/* Custom */}
            <TabsContent value="custom" className="space-y-4">
              <Input
                placeholder="Flow name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                placeholder="Flow description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button className="w-full" onClick={handleSaveFlow}>
                Save Flow
              </Button>
            </TabsContent>

            {/* Upload */}
            <TabsContent value="upload" className="space-y-4">
              <Input
                placeholder="Flow name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                placeholder="Flow description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                type="file"
                accept=".drawio,.xml"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <Button className="w-full" onClick={handleSaveFlow}>
                Upload Flow
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};
