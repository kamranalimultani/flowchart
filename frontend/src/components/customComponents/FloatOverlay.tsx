import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react"; // Or any icon set
import { X, ArrowLeft, Maximize2 } from "lucide-react"; // Example buttons

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  loading: boolean;
  viewForm: boolean;
  setViewForm: (open: boolean) => void;
  selectedTitle?: string;
  onCheck: (id: string, checked: boolean) => void;
}

export const FloatSidebar = ({
  open,
  setOpen,
  items,
  loading,
  viewForm,
  setViewForm,
  selectedTitle,
  onCheck,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");

  // Filter items by search
  const filteredItems = items.filter((i) =>
    i.title?.toLowerCase().includes(search.toLowerCase())
  );

  return open ? (
    <div
      id="float-sidebar-modal"
      className={`fixed top-8 right-8 z-50
        ${expanded ? "w-[92vw] md:w-[95vw]" : "w-[92vw] md:w-[440px]"}
        max-w-full h-[85vh] md:h-[95vh]
        backdrop-blur-lg bg-background/80 border border-border shadow-2xl rounded-xl
        transition-all duration-300 flex flex-col gap-4 p-4 overflow-y-auto`}
      style={{ WebkitBackdropFilter: "blur(12px)" }}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {viewForm && (
            <Button
              size="icon"
              variant="ghost"
              className="rounded"
              onClick={() => setViewForm(false)}
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="rounded"
            onClick={() => setExpanded((v) => !v)}
          >
            <Maximize2
              style={{ transform: expanded ? "rotate(180deg)" : undefined }}
              size={20}
            />
          </Button>
        </div>
        {!viewForm && (
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-1/2"
            autoFocus
          />
        )}
        {viewForm && (
          <span className="font-semibold text-base md:text-lg">
            {selectedTitle || "Form Details"}
          </span>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="rounded"
          onClick={() => setOpen(false)}
        >
          <X size={20} />
        </Button>
      </div>

      {!viewForm && (
        <span className="text-lg font-semibold mb-2">List of Ledgers</span>
      )}

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-[60vh] animate-pulse">
            <span>Loading…</span>
          </div>
        ) : !viewForm ? (
          filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-lg p-3
                  border border-border transition-colors cursor-pointer
                  ${
                    item.checked
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }
                `}
              >
                <Checkbox
                  checked={item.checked}
                  className="mr-2"
                  onCheckedChange={(checked) => onCheck(item.id, !!checked)}
                />
                <span className="flex-1">{item.title}</span>
                {item.checked && (
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <Eye size={20} />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32">
              <span>No Ledgers found</span>
            </div>
          )
        ) : (
          <div className="p-4">
            {/* Render form details or history tab here */}
            {selectedTitle || "Form Details"}
          </div>
        )}
      </div>
    </div>
  ) : null;
};
