import { ProjectContext } from "@/contexts/project-context";
import { useContext } from "react";

export default function useProjectContext() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }

  return context;
}
