'use client';
import { useEffect, useState, useContext } from 'react';

// import projectMockData from "@/mock-data/v0/projects.json";
import { redirect, useSearchParams } from 'next/navigation';
import OneTicketCheckPart from '@/components/Project/main/OneTicketCheckPart';
import { OneProject } from '@/domain/OneProject';
import { OneTicket } from '@/domain/OneTicket';
import { useTicketProjectList } from '@/context/contractContext';
import { AppContext } from '@/app/layout';

export default function TicketCheck() {
  const { account } = useContext(AppContext);
  const params = useSearchParams();
  const ticketIdStr = params.get('id') ?? '';
  const t_addr = params.get('contract') ?? '';
  console.log(ticketIdStr);
  console.log(t_addr);
  const [oneProjectData, setOneProjectData] = useState<OneProject | null>(null);
  const [oneTicketData, setOneTicketData] = useState<OneTicket | null>(null);

  const { getProject, getTicket } = useTicketProjectList();

  const initSet = async () => {
    const tempProject = getProject(t_addr);
    const tempTicket = await getTicket(t_addr, ticketIdStr);
    if (tempProject !== null && tempTicket !== null) {
      setOneProjectData(tempProject);
      setOneTicketData(tempTicket);
    }
  };
  useEffect(() => {
    initSet();
  }, []);
  if (!account) {
    return redirect('/');
  }
  return (
    <div className="">
      {ticketIdStr !== null &&
      oneProjectData !== null &&
      oneTicketData !== null ? (
        <OneTicketCheckPart
          projectData={oneProjectData}
          ticketData={oneTicketData}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
