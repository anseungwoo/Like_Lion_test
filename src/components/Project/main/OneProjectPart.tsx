'use client';
import React, { useEffect, useState, useContext } from 'react';
import './ProjectStyles.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import OneTicketThumb from './OneTicketThumb';
import {
  dateToStrEng,
  msToPeriodStrEng,
  oneDayDateNumber,
} from '@/utils/date_util';
import {
  attendance,
  attendancePointCheck,
  getMyLastTimeOfAttendance,
  ticketBuying,
} from '@/utils/web3/web3_v2';
import { AppContext } from '@/app/layout';
import { OneTicket } from '@/domain/OneTicket';
import { OneProject } from '@/domain/OneProject';
import { BlockLoding, Loding } from '@/compounds/Loding';
import { redirect } from 'next/navigation';
import { useTicketProjectList } from '@/context/contractContext';
const { Badge, Descriptions } = require('antd');
interface OneProjectPartProps {
  projectData: OneProject | null;
}

function OneProjectPart({ projectData, ...restProps }: OneProjectPartProps) {
  const { updateTickets } = useTicketProjectList();
  const [lastCheckTime, setLastCheckTime] = useState<number>(0);
  const [nowTime, setNowTime] = useState<number>(Date.now());
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  function ticketClick(ticketId: number) {
    // 클릭한 카드의 ID에 따라 상태값 변경
    setSelectedId(ticketId === selectedId ? null : ticketId);
    console.log('Clicked Ticket : ' + ticketId);
  }

  // const [count, setCount] = useState<number[]>([]);
  const [count, setCount] = useState<number>(0);
  const { account } = useContext(AppContext);
  const [buyLoding, setBuyLoding] = useState<boolean>(false);
  const [isRedirect, setIsRedirect] = useState<boolean>(false);

  const clickPurchaseBtn = () => {
    if (selectedId !== null) {
      setOpenDialog(true);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  const purchaseTicket = async () => {
    if (selectedId !== null) {
      let temp: OneTicket | null = null;

      for (
        let index = 0;
        index < (projectData?.tickets ?? []).length;
        index++
      ) {
        const oneTicket = projectData!.tickets[index];
        if (oneTicket.id === selectedId) {
          temp = oneTicket;
          break;
        }
      }
      if (temp !== null) {
        setBuyLoding(true);
        const response = await ticketBuying(
          selectedId,
          temp.price,
          temp.contract,
          account
        );
        console.log('구매 함수 구매함수!!!!');
        console.log(response);
        setIsRedirect(true);
      } else {
      }
      // TODO response 성공/실패 확인
    }

    setOpenDialog(false);
  };
  useEffect(() => {
    setInterval(() => {
      setNowTime(Date.now());
    }, 100);
  }, []);
  useEffect(() => {
    updateTickets(projectData!.contract);
    getAttendance();
    getLastTime();
  }, [account]);

  const getAttendance = async () => {
    const attendenceNum = await attendancePointCheck(
      projectData!.contract,
      account
    );
    if (attendenceNum !== null) {
      console.log('count set as ' + attendenceNum);
      setCount(attendenceNum);
    }
    console.log(attendenceNum);
  };

  const getLastTime = async () => {
    const lastCheckTime = await getMyLastTimeOfAttendance(
      projectData!.contract,
      account
    );
    console.log('lastCheckTime');

    if (lastCheckTime !== null) {
      setLastCheckTime(blockTimeToNextJSTime(lastCheckTime));
    }
  };

  const clickAttendance = async () => {
    if (nowTime >= lastCheckTime) {
      // TODO await attendance 함수 실행
      const response = await attendance(projectData!.contract, account);
      // TODO await get User Attendance 함수 호출
      if (true) {
        await getAttendance();
      }
      await getLastTime();
    }
  };
  const blockTimeToNextJSTime = (value: number) => {
    return value * 1000;
  };

  if (projectData !== null) {
    return (
      <div className="w-full flex justify-center">
        <div className="inner">
          <img className="project-img " src={projectData.imgUrl} alt="" />
          <div className="project-title text-white pb-2">
            {projectData.title}
          </div>

          <Descriptions
            labelStyle={{
              color: 'rgba(255, 255, 255, 1.0)',
              backgroundColor: 'rgba(255, 111, 255, 0.656)',
              width: '150px',
              fontSize: '20px',
            }}
            contentStyle={{
              color: 'rgba(255, 255, 255, 1.0)',
              backgroundColor: 'rgba(245, 107, 255, 0.478)',
              fontSize: '20px',
            }}
            bordered
          >
            <Descriptions.Item label="티켓이름" span={4}>
              {projectData.title}
            </Descriptions.Item>
            <Descriptions.Item label=" 장소/지역" span={4}>
              {projectData.location}
            </Descriptions.Item>

            <Descriptions.Item label="일정" span={4}>
              {projectData.date}
            </Descriptions.Item>
            <Descriptions.Item label="공연시간" span={4}>
              {projectData.runningTime}
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={4}>
              <Badge
                status="processing"
                text="Running"
                style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 1.0)' }}
              />
            </Descriptions.Item>

            <Descriptions.Item label="티켓 정보" span={4}>
              {projectData.description}
            </Descriptions.Item>
          </Descriptions>

          <div className="text-xl font-bold py-4 text-white">티켓 목록</div>
          <div className=" flex flex-wrap gap-6 ">
            {projectData ? (
              projectData.tickets.map((v, i) => {
                return (
                  <OneTicketThumb
                    key={`${v.contract}_${v.id}`}
                    value={v}
                    isClicked={selectedId === v.id}
                    onClick={() => {
                      ticketClick(v.id);
                    }}
                    nowCount={count}
                  />
                );
              })
            ) : (
              <Loding></Loding>
            )}
          </div>

          <div className="flex flex-wrap justify-center my-3 text-white w-[80%] mx-auto text-[20px]">
            출석일 수 : {count}
          </div>
          {account ? (
            nowTime > lastCheckTime + oneDayDateNumber ? (
              <div
                className="flex flex-col justify-center items-center mx-auto hover:cursor-pointer border-[1px] border-white rounded-3xl w-[300px] py-2 text-center"
                onClick={clickAttendance}
              >
                <div className="text-[18px] text-white font-bold mb-1">
                  출석하기
                </div>
                {lastCheckTime !== 0 ? (
                  <div className="text-[12px] text-gray-300">{`최근 출석 : ${dateToStrEng(
                    new Date(lastCheckTime)
                  )}`}</div>
                ) : null}
                {/* <div className="text-[12px] text-gray-300">{`최근 출석 : ${dateToStrEng(
                new Date(lastCheckTime)
              )}`}</div> */}
              </div>
            ) : (
              <div className="flex justify-center mx-auto border-[1px] border-white rounded-3xl w-[300px] py-2 text-center">
                <div className="mr-[4px] text-white">남은 시간 : </div>
                <div className="text-red-500">
                  {msToPeriodStrEng(lastCheckTime + oneDayDateNumber - nowTime)}
                </div>
              </div>
            )
          ) : (
            <div></div>
          )}
          {selectedId === null ? (
            <div className="project-minting my-4">티켓 구매하기</div>
          ) : (
            <div
              className="project-minting-active my-4"
              onClick={clickPurchaseBtn}
            >
              티켓 구매하기
            </div>
          )}
          {isRedirect ? (
            redirect('/')
          ) : (
            <Dialog open={openDialog} onClose={handleClose}>
              <DialogTitle>NFT 구매</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  당신은 {count}번의 출석을 하였습니다. 지정하신 {selectedId}번
                  NFT는 구매가 가능합니다.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                {buyLoding ? (
                  <div className="flex ">
                    <div className="self-center"> 티켓 구매중..</div>
                    <BlockLoding></BlockLoding>
                  </div>
                ) : (
                  <div>
                    <Button onClick={handleClose}>취소</Button>
                    <Button onClick={purchaseTicket}>구매</Button>
                  </div>
                )}
              </DialogActions>
            </Dialog>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="ml-2 text-black" {...restProps}>
        <Loding></Loding>
      </div>
    );
  }
}

export default OneProjectPart;
