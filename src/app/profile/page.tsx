'use client';
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../layout';
import { OneProject } from '@/domain/OneProject';
import { OneTicket } from '@/domain/OneTicket';
import { getMyProjects, getMyTickets } from '@/utils/web3/web3_v2';
import { useTicketProjectList } from '@/context/contractContext';
import OneProjectThumb from '@/components/Project/home/OneProjectThumb';
import TicketProjectCheck from '@/components/Project/home/TicketProjectCheck';
import LoginDialog from '@/compounds/Redirect';
import { redirect } from 'next/navigation';
import { Loding } from '@/compounds/Loding';

export default function profile() {
  const { account } = useContext(AppContext);
  const { getProject, getTicket } = useTicketProjectList();
  const [myProjects, setMyProjects] = useState<OneProject[]>([]);
  const [myTickets, setMyTickets] = useState<OneTicket[]>([]);

  const initMyProjects = async () => {
    const response = await getMyProjects(account);
    const tcAddrs = response ?? [];

    let tempProjects: OneProject[] = [];
    for (let index = 0; index < tcAddrs.length; index++) {
      const t_addr = tcAddrs[index];
      const tempProj = getProject(t_addr);
      if (tempProj !== null) {
        tempProjects.push(tempProj);
      } else {
        //  TODO update one project 함수를 하나 만들면 됨
      }
    }
    setMyProjects(tempProjects);

    for (let index = 0; index < tcAddrs.length; index++) {
      const oneTicketContractAddr = tcAddrs[index];
      await initMyTickets(oneTicketContractAddr);
    }
  };
  const initMyTickets = async (t_addr: string) => {
    let tempTickets: OneTicket[] = [];
    const response = await getMyTickets(t_addr, account);
    const ticketIds = response ?? [];

    for (let index = 0; index < ticketIds.length; index++) {
      const ticketIdStr = ticketIds[index];
      const tTicket = await getTicket(t_addr, ticketIdStr);
      if (tTicket !== null) {
        tempTickets.push(tTicket);
      }
    }

    setMyTickets((prevTickets) => {
      return [...prevTickets, ...tempTickets];
    });
  };

  useEffect(() => {
    initMyProjects();
  }, []);

  if (!account) {
    return redirect('/');
  }
  return (
    <div className="w-full flex justify-center">
      <div className="inner">
        <div className="text-[30px] font-bold py-10 px-2">
          <div className="text-white">내 프로젝트 목록</div>
          <div className="grid grid-cols-3 auto-rows-auto gap-10 px-10 py-10">
            {myProjects ? (
              myProjects.map((v, i) => {
                return v ? (
                  <OneProjectThumb key={`${v.contract}_${i}`} oneProject={v} />
                ) : (
                  <Loding></Loding>
                );
              })
            ) : (
              <Loding></Loding>
            )}
          </div>
        </div>
        <div className="text-white text-[30px] font-bold">내 NFT 목록</div>
        <div className="grid grid-cols-3 auto-rows-auto gap-10 px-10 py-10">
          {myTickets ? (
            myTickets.map((v, i) => {
              return v ? (
                <TicketProjectCheck
                  key={`${v.id}_${v.contract}`}
                  id={v.id}
                  contract={v.contract}
                  imgUrl={v.imgUrl}
                  isUsed={v.ticket_is_used}
                />
              ) : (
                <Loding></Loding>
              );
            })
          ) : (
            <Loding></Loding>
          )}
        </div>
      </div>
      {/* <div className="text-[30px] font-bold py-10 px-2">
          <div>내 파츠 NFT</div>
          <ProjectThumbCompound />
        </div> */}
    </div>
  );
}
