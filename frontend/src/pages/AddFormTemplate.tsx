import React, { useEffect, useState } from "react";
import { SurveyCreator } from "survey-creator-react";
import * as survey from "survey-core";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, MoveLeft } from "lucide-react"; // spinner icon
import { toast } from "sonner"; // shadcn toast system
import { getRequest, postRequest, putRequest } from "@/utils/apiUtils";
import SurveyCreatorComponent from "@/components/SurveyJs/Survey";
import defaultDarkThemeColorsSurvey, { FlatDark } from "survey-core/themes";
/**
 * SurveyCreate component allows users to create or update survey forms.
 * It utilizes the SurveyCreator component to manage form creation and updates.
 *
 * @returns {React.ReactElement} The rendered SurveyCreate component.
 */
const AddFormTemplate: React.FC = () => {
  const [creator, setCreator] = useState<SurveyCreator | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const initializeSurveyCreator = async () => {
      const surveyCreator = new SurveyCreator();
      surveyCreator.showPreviewTab = false;
      surveyCreator.previewShowResults = false;
      // Apply dark theme to the creator

      if (location?.state) {
        const formData = location.state.form.form_data;

        surveyCreator.JSON = {
          ...formData,
          FlatDark,
        };
        // surveyCreator.JSON = location.state.form.form_data;
      }

      setCreator(surveyCreator);
    };

    initializeSurveyCreator();
  }, [location?.state]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const targetElement = document.querySelector(
        '[data-key="allowTypesense0"]'
      );

      if (targetElement) {
        const heading1 = document.createElement("h6");
        heading1.id = "noteHeading";
        heading1.textContent =
          "NOTE: You cannot exclude a column that is indexed. Use comma-separated values to include multiple columns. Leave empty for default.";
        heading1.style.fontSize = "small";
        heading1.style.color = "red";

        targetElement.insertBefore(heading1, targetElement.firstChild);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const handleSave = async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    setLoading(true);

    if (creator) {
      const data = creator.JSON;

      if (!data.title) {
        setLoading(false);
        toast.error("Please add ledger title before Create Template.", {
          description: "Add Template Title",
        });
        return;
      }

      let reqBody;

      if (location.state) {
        reqBody = {
          id: location.state.form.id, // use `id` instead of _id or form_id
          form_data: data,
        };
        console.log(reqBody);
      } else {
        reqBody = {
          form_data: data,
        };
      }

      try {
        await delay(1000);

        if (location.state && location.state?.form) {
          await putRequest(`/api/form-templates/${reqBody.id}`, reqBody, true);
        } else {
          await postRequest(`/api/form-templates`, reqBody, true);
        }

        setLoading(false);
        navigate("/forms-templates", { state: { from: "saveForm" } });
      } catch (error) {
        setLoading(false);
        console.error("Error saving form:", error);

        toast.error(
          "An error occurred while saving the form. Please try again.",
          {
            description: "Error Saving Form",
          }
        );
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-700 hover:text-black"
          >
            <MoveLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold">
            {location?.state?.form ? "Update" : "Add New"} Template Template
          </h1>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {location?.state?.form ? "Update Template" : "Save Template"}
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden p-4">
        <Card className="w-full h-full p-2">
          {creator ? (
            <SurveyCreatorComponent creator={creator} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AddFormTemplate;
