'use client';
import React, { useState, useEffect } from 'react';
import './ProjectThumbStyles.css';
import Link from 'next/link';
import { getWholeTicketNum } from '@/utils/web3/web3_v2';
import { OneProject } from '@/domain/OneProject';

interface OneProjectThumbProps {
  oneProject: OneProject;
}

function OneProjectThumb({ oneProject }: OneProjectThumbProps) {
  const [remainTicketNum, setRemainTicketNum] = useState<number>(0);
  const [totalTicketNum, setTotalTicketNum] = useState<number>(0);

  const initFunc = async () => {
    const { whole, remain } = await getWholeTicketNum(oneProject.contract);
    setRemainTicketNum(remain ?? 0);
    setTotalTicketNum(whole ?? 0);
  };
  useEffect(() => {
    initFunc();
  }, []);
  return (
    <Link
      href={`/project/${oneProject.contract}`}
      className="thumb-card hover:cursor-pointer"
    >
      <img className="thumb-card-img" src={oneProject.imgUrl} alt="" />
      <div className=" p-3">
        <div className="thumb-card-title pb-2  ">{oneProject.title}</div>
        <div className="thumb-card-description">{oneProject.description}</div>
      </div>

      <div className="flex justify-between">
        <div className="text-black text-2xl font-medium p-4">
          총 티켓 : {totalTicketNum}
        </div>
        <div className="text-black text-2xl font-medium p-4">
          남은 티켓 : {remainTicketNum}
        </div>
      </div>
    </Link>
  );
}

export default OneProjectThumb;
