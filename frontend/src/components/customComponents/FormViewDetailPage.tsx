/* eslint-disable @typescript-eslint/no-explicit-any */
import { postRequest } from "@/utils/apiUtils";
import React, { useEffect, useState } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui"; // ✅ Import Survey renderer
// import "survey-core/defaultV2.min.css"; // ✅ Core styles (can be swapped with theme CSS if needed)

interface Props {
  formData: any;
  idAttribute: string;
  flow_id: number;
}

export const FormViewDetailPage: React.FC<Props> = ({
  formData,
  idAttribute,
  flow_id,
}) => {
  const [surveyModel, setSurveyModel] = useState<Model | null>(null);

  useEffect(() => {
    if (formData && idAttribute !== "") {
      const newSurvey = new Model(formData.form_data);
      newSurvey.showCompletedPage = true;

      // ✅ Apply your custom theme
      newSurvey.applyTheme({
        cssVariables: {
          "--sjs-general-backcolor": "rgba(255, 255, 255, 1)",
          "--sjs-general-backcolor-dark": "rgba(248, 248, 248, 1)",
          "--sjs-general-backcolor-dim": "rgba(243, 243, 243, 1)",
          "--sjs-general-backcolor-dim-light": "rgba(249, 249, 249, 1)",
          "--sjs-general-backcolor-dim-dark": "rgba(243, 243, 243, 1)",
          "--sjs-general-forecolor": "rgba(0, 0, 0, 0.91)",
          "--sjs-general-forecolor-light": "rgba(0, 0, 0, 0.45)",
          "--sjs-primary-backcolor": "rgba(255, 151, 0, 1)",
          "--sjs-primary-backcolor-light": "rgba(255, 151, 0, 0.1)",
          "--sjs-primary-backcolor-dark": "rgba(255, 130, 0, 1)",
          "--sjs-primary-forecolor": "rgba(255, 255, 255, 1)",
          "--sjs-primary-forecolor-light": "rgba(255, 255, 255, 0.25)",
          "--sjs-secondary-backcolor": "rgba(255, 152, 20, 1)",
          "--sjs-secondary-backcolor-light": "rgba(255, 152, 20, 0.1)",
          "--sjs-secondary-backcolor-semi-light": "rgba(255, 152, 20, 0.25)",
          "--sjs-secondary-forecolor": "rgba(255, 255, 255, 1)",
          "--sjs-secondary-forecolor-light": "rgba(255, 255, 255, 0.25)",
          "--sjs-special-green": "rgba(255, 151, 0, 1)",
          "--sjs-special-green-light": "rgba(255, 151, 0, 0.1)",
          "--sjs-special-blue": "rgba(67, 127, 217, 1)",
          "--sjs-special-blue-light": "rgba(67, 127, 217, 0.1)",
          "--sjs-special-yellow": "rgba(255, 152, 20, 1)",
          "--sjs-special-yellow-light": "rgba(255, 152, 20, 0.1)",
          "--sjs-border-light": "rgba(0, 0, 0, 0.09)",
          "--sjs-border-default": "rgba(0, 0, 0, 0.16)",
          "--sjs-border-inside": "rgba(0, 0, 0, 0.16)",
        },
        themeName: "doubleborder",
        colorPalette: "dark",
        isPanelless: true,
      });
      newSurvey.completedHtml = `<div class="text-center p-4">
        <h3 class="text-xl font-semibold">Thank you!</h3>
        <p>Your response has been submitted successfully.</p>
      </div>`;
      newSurvey.onComplete.add(async (sender) => {
        const payload = {
          flow_id: flow_id, // from props / API
          form_template_id: formData.id,
          node_id: idAttribute,
          response: sender.data, // all form responses
          user_id: null, // optional
        };

        try {
          await postRequest("/api/form-responses", payload, false);
        } catch (err) {
          console.log(err);
          alert("Failed to submit form.");
        }
      });

      setSurveyModel(newSurvey);

      // Example call to getFormResHistory
    }
  }, [formData]);

  return (
    <div className="p-4">
      {surveyModel ? (
        <Survey model={surveyModel} />
      ) : (
        <p className="text-gray-500">Loading survey...</p>
      )}
    </div>
  );
};
