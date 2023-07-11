'use client';
import { useEffect, useState } from 'react';

// import projectMockData from "@/mock-data/v0/projects.json";

import { usePathname } from 'next/navigation';
import { useTicketProjectList } from '@/context/contractContext';
import { OneProject } from '@/domain/OneProject';
import OneProjectPart from '@/components/Project/main/OneProjectPart';
import Loding from '@/compounds/Loding';

export default function ProjectId() {
  const id = usePathname()?.substring(9);
  const [oneProjectData, setOneProjectData] = useState<OneProject | null>(null);
  const { getProject, updateTickets } = useTicketProjectList();

  const initAct = async () => {
    if (id) {
      await updateTickets(id);
      const project = getProject(id);
      console.log(project);
      if (project !== null) {
        setOneProjectData(project!);
      }
      console.log('update success!!');
    }
  };
  useEffect(() => {
    initAct();
  }, []);

  return (
    <div className="bg-white">
      {id != null && oneProjectData !== null ? (
        <OneProjectPart projectData={oneProjectData} />
      ) : (
        <div className="flex justify-center">
          <div className="inner">
            <div className="flex justify-center">
              <Loding></Loding>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
