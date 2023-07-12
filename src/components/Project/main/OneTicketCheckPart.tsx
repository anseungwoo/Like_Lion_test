'use client';
import React, { useEffect, useState, useContext } from 'react';
import './ProjectStyles.css';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { OneProject } from '@/domain/OneProject';
import { OneTicket } from '@/domain/OneTicket';
import {
  ownerOfTokenId,
  processTicketUsing,
  transactionTracking,
} from '@/utils/web3/web3_v2';
import { AppContext } from '@/app/layout';
import { redirect } from 'next/navigation';
import { BlockLoding } from '@/compounds/Loding';

export interface ProjectData {
  id: number;
  contract: string;
  title: string;
  description: string;
  imgUrl: string;
  tickets: TicketType[];
}

export type TicketType = {
  id: number; // tokenId
  seat: string;
  price: string;
  minimum_attendance: number;
  ticket_is_used: boolean;
};

interface OneProjectPartProps {
  projectData: OneProject;
  ticketData: OneTicket;
}

function OneTicketCheckPart({
  projectData,
  ticketData,
  ...restProps
}: OneProjectPartProps) {
  const { account } = useContext(AppContext);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [validUse, setValidUse] = useState<boolean>(false);

  const [buyLoding, setBuyLoding] = useState<boolean>(false);
  const [isRedirect, setIsRedirect] = useState<boolean>(false);

  const checkOwner = async () => {
    const response =
      (await ownerOfTokenId(projectData.contract, ticketData.id)) ?? '';
    if (typeof response !== 'string') return;
    if (response.toLowerCase() === account.toLowerCase()) {
      setIsOwner(true);
    }
  };
  const checkValidTicket = async () => {
    const response: boolean = await transactionTracking(
      ticketData.id,
      projectData.contract,
      account
    );
    setValidUse(response);
  };

  useEffect(() => {
    checkOwner();
    checkValidTicket();
  }, []);

  const useTicketClick = async () => {
    setBuyLoding(true);

    const response = await processTicketUsing(
      projectData.contract,
      account,
      ticketData.id
    );
    console.log('useTicketClick');
    console.log(response);
    checkValidTicket();
    setIsRedirect(true);
    setOpenDialog(false);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  if (projectData) {
    return (
      <div className="w-full flex justify-center">
        <div className="inner">
          <img className="project-img" src={ticketData.imgUrl} alt="" />
          <div className="project-title">{projectData.title}</div>
          <div className="project-description">{projectData.description}</div>
          <div className="project_ticket">
            {isOwner && validUse && !ticketData.ticket_is_used ? (
              <div
                className="project_ticket_use hover:cursor-pointer"
                onClick={() => {
                  handleClickOpen();
                }}
              >
                티켓 사용 가능
              </div>
            ) : (
              <div className="project_ticket_nuUse">사용 불가 티켓</div>
            )}
          </div>
          {isRedirect ? (
            redirect('/')
          ) : (
            <Dialog open={openDialog} onClose={handleClose}>
              <DialogTitle>티켓 사용/입장 하기</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  티켓 관리자외에 사용/입장하기 누를시 불이익이 있을 수
                  있습니다.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                {buyLoding ? (
                  <div className="flex ">
                    <div className="self-center"> 티켓 사용 유무 체크중..</div>
                    <BlockLoding></BlockLoding>
                  </div>
                ) : (
                  <div>
                    <Button onClick={handleClose}>취소</Button>
                    <Button onClick={useTicketClick}>사용/입장</Button>
                  </div>
                )}
              </DialogActions>
            </Dialog>
          )}
          ;
        </div>
      </div>
    );
  }
  return (
    <div className="ml-2 text-black" {...restProps}>
      onC ... 로딩중 ...
    </div>
  );
}

export default OneTicketCheckPart;
