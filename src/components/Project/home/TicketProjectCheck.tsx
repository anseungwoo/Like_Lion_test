'use client';
import React, { useState, useEffect, useContext } from 'react';
import './TicketProjectCheck.css';
import Link from 'next/link';
import { transactionTracking } from '@/utils/web3/web3_v2';
import { AppContext } from '@/app/layout';

interface OneProjectThumbProps {
  id: number;
  contract: string;
  imgUrl: string;
  isUsed: boolean;
}
function TicketProjectCheck({
  id,
  contract,
  imgUrl,
  isUsed,
}: OneProjectThumbProps) {
  const [validUse, setValidUse] = useState<boolean>(false);
  const { account } = useContext(AppContext);
  const checkValidTicket = async () => {
    const response: boolean = await transactionTracking(id, contract, account);
    setValidUse(response);
  };

  useEffect(() => {
    checkValidTicket();
  }, []);

  return (
    <Link
      href={`/profile/ticket-check?id=${
        isUsed ? `${id}_use` : `${id}`
      }&contract=${contract}`}
      className=" hover:cursor-pointer"
    >
      <div className="Ticket-Group">
        <div className="card-front">
          <div className="Ticket-image-cover">
            <img className="Ticket-card-img" src={imgUrl} alt="" />
          </div>
          <div className=" p-3">
            <div className="Ticket-card-title pb-2  ">{id}</div>
            <div className="Ticket-card-description">{contract}</div>
          </div>
        </div>

        <div className="card-back">
          {validUse && !isUsed ? (
            <p className="use">사용 가능</p>
          ) : (
            <p className="unUse">사용 불가</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default TicketProjectCheck;
