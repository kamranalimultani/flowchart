import {
  SurveyCreatorComponent as SurveyCreatorUI,
  SurveyCreator,
} from "survey-creator-react";
// components/SurveyCreator.tsx
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
import "survey-creator-core/survey-creator-core.css";

interface Props {
  creator: SurveyCreator;
}

// Optionally wrap the creator in a div with a fixed width/height to prevent layout issues
const SurveyCreatorComponent = (props: Props) => {
  return props.creator ? (
    <div style={{ height: "90vh", width: "100%", minWidth: "330px" }}>
      <SurveyCreatorUI creator={props.creator} />
    </div>
  ) : null;
};

export default SurveyCreatorComponent;
