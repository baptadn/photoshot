import { IStudioPageProps } from "@/pages/studio/[id]";
import { Shot } from "@prisma/client";
import axios from "axios";
import { createContext, ReactNode, RefObject, useRef, useState } from "react";
import { useQuery } from "react-query";

export const PROJECTS_PER_PAGE = 9;

export const ProjectContext = createContext<{
  shots: Shot[];
  hasMoreResult: boolean;
  shotCredits: number;
  promptWizardCredits: number;
  updateCredits: (shotCredits: number) => void;
  updatePromptWizardCredits: (promptWizardCredits: number) => void;
  isLoadingMore: boolean;
  addShot: (shot: Shot) => void;
  project: IStudioPageProps["project"];
  shotTemplate: Shot | undefined;
  updateShotTemplate: (shot: Shot | undefined) => void;
  fetchShots: () => void;
  promptInputRef: RefObject<HTMLTextAreaElement>;
  promptImageUrl: string | undefined;
  setPromptImageUrl: (promptImage: string | undefined) => void;
}>(null!);

export const ProjectProvider = ({
  children,
  project,
}: {
  children: ReactNode;
  project: IStudioPageProps["project"];
}) => {
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const [shots, setShots] = useState(project.shots);
  const [shotTemplate, setShotTemplate] = useState<Shot>();
  const [promptImageUrl, setPromptImageUrl] = useState<string>();
  const [skip, setSkip] = useState(PROJECTS_PER_PAGE);
  const [hasMoreResult, setHasMoreResult] = useState(
    project.shots.length < project._count.shots
  );

  const [shotCredits, setShotCredits] = useState(project.credits);
  const [promptWizardCredits, setPromptWizardCredits] = useState(
    project.promptWizardCredits
  );

  const { isLoading: isLoadingMore, refetch } = useQuery(
    `shots-${PROJECTS_PER_PAGE}-${skip}`,
    () =>
      axios.get<{ shots: Shot[]; shotsCount: number }>(
        `/api/projects/${project.id}/shots?take=${PROJECTS_PER_PAGE}&skip=${skip}`
      ),
    {
      enabled: false,
      onSuccess: (response) => {
        const { data } = response;
        setHasMoreResult(shots.length + data.shots.length < data.shotsCount);

        if (data.shots.length) {
          setShots([...shots, ...data.shots]);
          setSkip(skip + PROJECTS_PER_PAGE);
        }
      },
    }
  );

  const addShot = (shot: Shot) => {
    setShots([shot, ...shots]);
    setShotCredits(shotCredits - 1);
    setSkip(skip + 1);
  };

  const updateCredits = (credits: number) => {
    setShotCredits(credits);
  };

  const updatePromptWizardCredits = (credits: number) => {
    setPromptWizardCredits(credits);
  };

  const updateShotTemplate = (shotTemplate: Shot | undefined) => {
    setShotTemplate(shotTemplate);

    if (shotTemplate) {
      promptInputRef.current!.value = shotTemplate.prompt;
    }
  };

  const fetchShots = () => {
    refetch();
  };

  return (
    <ProjectContext.Provider
      value={{
        shots,
        hasMoreResult,
        shotCredits,
        updateCredits,
        isLoadingMore,
        addShot,
        project,
        shotTemplate,
        updateShotTemplate,
        fetchShots,
        promptInputRef,
        promptWizardCredits,
        updatePromptWizardCredits,
        promptImageUrl,
        setPromptImageUrl,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
