'use client';

import OneMetadataItem from '@/components/Project/create/OneMetadataItem';
import TitleWithInput from '@/components/Project/create/TitleWithInput';

import axios from 'axios';
import { useState, useRef, useContext } from 'react';
import { redirect } from 'next/navigation';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialogname from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { AppContext } from '@/app/layout';
import { makeTicketContract } from '@/utils/web3/web3_v2';
const pinataJwt = process.env.NEXT_PUBLIC_JWT;

type AttributeSet = {
  trait_type: string;
  value: string;
};

type JsonObject = {
  image: string;
  name: string;
  description: string;
  attributes: AttributeSet[];
};

const createJson = (
  image: string,
  name: string,
  description: string,
  date: string,
  location: string,
  seat: string,
  price: string,
  time: string,
  minimum_attendance: string,
  ticket_is_used: string
): JsonObject => ({
  image,
  name,
  description,
  attributes: [
    {
      trait_type: 'Date',
      value: date,
    },
    {
      trait_type: 'Location',
      value: location,
    },
    {
      trait_type: 'Seat',
      value: seat,
    },
    {
      trait_type: 'Price',
      value: price,
    },
    {
      trait_type: 'RunningTime',
      value: time,
    },
    {
      trait_type: 'ticket_is_used',
      value: ticket_is_used,
    },
    {
      trait_type: 'minimum_attendance',
      value: minimum_attendance,
    },
  ],
});
const ProjectCreatePage = () => {
  const { account, setAccount } = useContext(AppContext);
  const [name, setName] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState('');
  const imageRef = useRef<HTMLInputElement>(null);
  const [imageUse, setImageUse] = useState('');
  const imageUseRef = useRef<HTMLInputElement>(null);
  const [time, setTime] = useState('');
  const timeRef = useRef<HTMLInputElement>(null);
  const [location, setLocation] = useState('');
  const locationRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState('');
  const dateRef = useRef<HTMLInputElement>(null);

  const [simbol, setSimbol] = useState('');
  const simbolRef = useRef<HTMLInputElement>(null);
  const [cName, setCName] = useState('');
  const cNameRef = useRef<HTMLInputElement>(null);

  const [seat, setSeat] = useState('');
  const seatRef = useRef<HTMLInputElement>(null);
  const [price, setPrice] = useState('');
  const priceRef = useRef<HTMLInputElement>(null);
  const [minimumAttendance, setMinimumAttendance] = useState('');
  const minimumAttendanceRef = useRef<HTMLInputElement>(null);

  const [warning, setWarning] = useState<string>('');

  const [notUseJsonArray, setNotUseJsonArray] = useState<JsonObject[]>([]);
  const [useJsonArray, setUseJsonArray] = useState<JsonObject[]>([]);

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // const [count, setCount] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleAddInput = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !cName ||
      !simbol ||
      !name ||
      !date ||
      !location ||
      !seat ||
      !price ||
      !description ||
      !image ||
      !imageUse ||
      !time ||
      !minimumAttendance ||
      isNaN(Number(price)) ||
      isNaN(Number(minimumAttendance))
    ) {
      setTimeout(() => {
        if (!cName) {
          setWarning('티켓 이름을 적어 주세요');
          cNameRef.current?.focus();
        } else if (!simbol) {
          setWarning('심볼 적어 주세요');
          simbolRef.current?.focus();
        } else if (!imageUse) {
          setWarning('발매 후 티켓 이미지url르 적어 주세요');
          imageUseRef.current?.focus();
        } else if (!name) {
          setWarning('프로젝트 명/제목을 적어 주세요');
          nameRef.current?.focus();
        } else if (!description) {
          setWarning('설명 문구를 적어 주세요');
          descriptionRef.current?.focus();
        } else if (!image) {
          setWarning('이미지 uri을 적어 주세요');
          imageRef.current?.focus();
        } else if (!location) {
          setWarning('장소을 적어 주세요');
          locationRef.current?.focus();
        } else if (!time) {
          setWarning('시간을 적어 주세요');
          timeRef.current?.focus();
        } else if (!date) {
          setWarning('일정을 적어 주세요');
          dateRef.current?.focus();
        } else if (!price) {
          setWarning('가격을 적어 주세요');
          priceRef.current?.focus();
        } else if (isNaN(Number(price))) {
          priceRef.current?.focus();
          setWarning('가격은 숫자를 입력해주세요');
        } else if (!seat) {
          setWarning('좌석을 적어 주세요');
          seatRef.current?.focus();
        } else if (!minimumAttendance) {
          setWarning('출석 일수를 적어 주세요');
          minimumAttendanceRef.current?.focus();
        } else if (isNaN(Number(minimumAttendance))) {
          minimumAttendanceRef.current?.focus();
          setWarning('출석 일수를 숫자로 입력해주세요');
        }
      }, 0);

      return;
    }

    setWarning('');
    setNotUseJsonArray((prevState) => [
      ...prevState,
      createJson(
        image,
        name,
        description,
        date,
        location,
        seat,
        price,
        time,
        minimumAttendance,
        'false'
      ),
    ]);
    setUseJsonArray((prevState) => [
      ...prevState,
      createJson(
        imageUse,
        name,
        description,
        date,
        location,
        seat,
        price,
        time,
        minimumAttendance,
        'true'
      ),
    ]);
  };

  const matadataRemove = (index: number) => {
    setNotUseJsonArray((prevState) => {
      const newArray = [...prevState];
      newArray.splice(index, 1);
      return newArray;
    });
    setUseJsonArray((prevState) => {
      const newArray = [...prevState];
      newArray.splice(index, 1);
      return newArray;
    });
  };
  const jsonToFile = (json: object, filename: string): File => {
    // JSON 객체를 Blob 객체로 변환
    const jsonString = JSON.stringify(json);
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Blob 객체에 파일 이름을 부여하여 File 객체로 변환
    return new File([blob], filename, { type: 'application/json' });
  };
  const addNewProject = async (event: React.FormEvent) => {
    event.preventDefault();

    let tokenId: number[] = [];
    let price: number[] = [];
    let minCount: number[] = [];
    const ticketNum = notUseJsonArray.length;
    let uri = '';
    const name = cName;
    const symbol = simbol;

    notUseJsonArray.map((v, i) => {
      const findPrice = v.attributes.find((element) => {
        return element.trait_type === 'Price';
      })?.value;
      const findminimum_attendance = v.attributes.find((element) => {
        return element.trait_type === 'minimum_attendance';
      })?.value;
      tokenId.push(i + 1);
      price.push(Number(findPrice));
      minCount.push(Number(findminimum_attendance));
    });

    console.log(tokenId);
    console.log(price);
    console.log(minCount);
    console.log(ticketNum);
    console.log(name);
    console.log(symbol);

    if (notUseJsonArray.length <= 0) {
      setWarning('NFT정보가 1개 이상은 입력하셔야 합니다.');
      return;
    }

    const form = new FormData();

    notUseJsonArray.map((v, i) => {
      form.append('file', jsonToFile(v, `${i + 1}.json`), `data/${i + 1}.json`);
    });
    useJsonArray.map((v, i) => {
      form.append(
        'file',
        jsonToFile(v, `${i + 1}_use.json`),
        `data/${i + 1}_use.json`
      );
    });

    form.append('pinataMetadata', JSON.stringify({ name: cName }));

    form.append(
      'pinataOptions',
      JSON.stringify({ wrapWithDirectory: false, cidVersion: 0 })
    );
    setIsLoading(true);
    try {
      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        form,
        {
          headers: {
            'Content-Type': `multipart/form-data`,
            Authorization: `Bearer ${pinataJwt}`,
          },
        }
      );

      uri =
        'https://gold-alleged-yak-272.mypinata.cloud/ipfs/' + res.data.IpfsHash;

      const response = await makeTicketContract(
        tokenId,
        price,
        minCount,
        ticketNum,
        uri,
        name,
        symbol,
        account
      );
      if (response !== null) {
        setOpenDialog(false);
        setIsLoading(false);
        console.log(response);
        console.log(typeof response);
      }
    } catch (error) {
      setOpenDialog(false);
      setIsLoading(false);
      console.error(error);
    }
  };
  if (!account) {
    return redirect('/');
  }
  return (
    <div className="flex justify-center">
      <div className="inner">
        <div className=" flex flex-col items-stretch mx-10 my-8 text-white">
          <div className="text-[20px] self-start font-bold">프로젝트 정보</div>
          <div className="ml-8">
            <TitleWithInput
              title="* NFT 이름 : "
              placeholder="NFT 이름 (Link Ticket)"
              ref={cNameRef}
              onInputChange={setCName}
            />
            <TitleWithInput
              title="* NFT SIMBOL : "
              placeholder="NFT SIMBOL 입력 (LT)"
              ref={simbolRef}
              onInputChange={setSimbol}
            />
            <TitleWithInput
              title="* 프로젝트명 : "
              placeholder="프로젝트명 입력"
              ref={nameRef}
              onInputChange={setName}
            />
            <TitleWithInput
              title="* 콘서트 설명 : "
              placeholder="Description 입력"
              ref={descriptionRef}
              onInputChange={setDescription}
            />
            <TitleWithInput
              title="* 공통 image : "
              placeholder="Image Url 입력"
              ref={imageRef}
              onInputChange={setImage}
            />
            <TitleWithInput
              title="* 티켓 발매 후 공통 image : "
              placeholder="티켓 발매 후 공통image Url 입력"
              ref={imageUseRef}
              onInputChange={setImageUse}
            />
            <TitleWithInput
              title="* 장소 : "
              placeholder="장소 입력"
              ref={locationRef}
              onInputChange={setLocation}
            />
            <TitleWithInput
              title="* 시간 : "
              placeholder="시간 입력(00:00 ~24:00 , 00시부터 24시까지)"
              ref={timeRef}
              onInputChange={setTime}
            />
            <TitleWithInput
              title="* 일정 : "
              placeholder="일정 입력(2000-01-01, 2000년01월01일)"
              ref={dateRef}
              onInputChange={setDate}
            />
          </div>
          <div className="text-[20px] self-start font-bold mt-8 mb-4">
            NFT 개별 정보
          </div>
          <TitleWithInput
            title="* 가격 : "
            placeholder="가격 입력(원 단위)"
            ref={priceRef}
            onInputChange={setPrice}
          />
          <TitleWithInput
            title="* 좌석 : "
            placeholder="좌석 입력(예시) (A열 1번 ->A-1) ,좌석 없음 등등)"
            ref={seatRef}
            onInputChange={setSeat}
          />
          <TitleWithInput
            title="* 출석 일수 : "
            placeholder="출석 최소 일수 입력"
            ref={minimumAttendanceRef}
            onInputChange={setMinimumAttendance}
          />
          <button
            className="mx-4 border-[1px] border-gray-500 text-gray-500 text-[15px] rounded-2xl grow hover:bg-gray-100"
            type="button"
            onClick={handleAddInput}
          >
            개별정보 추가 +
          </button>
          {warning && <p style={{ color: 'red' }}>{warning}</p>}
          <div className="text-[12px] mt-8 mb-4">
            개수 : {notUseJsonArray.length}개
          </div>
          <div className="flex flex-wrap">
            {notUseJsonArray
              .concat()
              .reverse()
              .map((v, i) => (
                <OneMetadataItem
                  key={i}
                  removeFunc={() => {
                    matadataRemove(i);
                  }}
                  value={v}
                />
              ))}
          </div>
          {warning && <p style={{ color: 'red' }}>{warning}</p>}
          <div
            className="flex justify-center items-center my-4 border-[1px] border-black w-full h-8 rounded-full hover:cursor-pointer hover:bg-red-300"
            onClick={handleClickOpen}
          >
            제출
          </div>
          <Dialog open={openDialog} onClose={handleClose}>
            <Dialogname>NFT 구매</Dialogname>
            <DialogContent>
              <DialogContentText>
                당신은 {notUseJsonArray.length}개의 퀘스트를 NFT를 생성하게
                됩니다,
              </DialogContentText>

              <DialogContentText>
                <span style={{ color: 'red' }}>내용 및 입력 값을</span> 잘
                확인하고 적어 주시기바랍니다.
                <br />
                <br />
                <br />
                {notUseJsonArray.length <= 0 && (
                  <p style={{ color: 'red' }}>
                    민팅할수 있는 정보가 존재 하지 않습니다.
                  </p>
                )}
              </DialogContentText>
            </DialogContent>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <DialogActions>
                <Button onClick={handleClose}>취소</Button>
                <Button onClick={addNewProject}>민팅</Button>
              </DialogActions>
            )}
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreatePage;
