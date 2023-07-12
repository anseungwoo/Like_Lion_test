import { OneTicket } from '@/domain/OneTicket';
interface OneTicketThumbProps {
  value: OneTicket;
  onClick: () => void;
  isClicked: boolean;
  nowCount: number;
}
function OneTicketThumb({
  value,
  onClick,
  isClicked,
  nowCount,
}: OneTicketThumbProps) {
  if (value.isSell) {
    return (
      <div className="relative bg-gray-100 mx-2 my-1 border-gray-500 w-fit  border-[1px] p-4 rounded-xl">
        <div> id : {value.id}</div>
        <div> 가격 : {value.price}</div>
        <div> 좌석 : {value.seat}</div>
        <div> 최소출석일수 : {value.minimum_attendance}</div>
        <div> 티켓 발급 상태 : {value.ticket_is_used ? '발급' : '미발급'}</div>
        <div className="absolute whitespace-nowrap top-1/2 translate-x-1/2 right-1/2 translate-y-[-50%]  text-red-500 font-extrabold text-[25px] red-300">
          판매 완료
        </div>
      </div>
    );
  }
  if (isClicked) {
    return (
      <div
        className="relative mx-2 my-1 hover:cursor-pointer border-red-500  bg-white bg-opacity-20 text-white font-bold   w-fit border-[2px] p-4 rounded-xl"
        onClick={onClick}
      >
        <div> id : {value.id}</div>
        <div> 가격 : {value.price}</div>
        <div> 좌석 : {value.seat}</div>
        <div> 최소출석일수 : {value.minimum_attendance}</div>
        <div> 티켓 발급 상태 : {value.ticket_is_used ? '발급' : '미발급'}</div>
      </div>
    );
  } else {
    return (
      <div
        className="relative mx-2 my-1 hover:cursor-pointer bg-white bg-opacity-20  text-white font-bold border-sky-100 w-fit border-[1px] p-4 rounded-xl"
        onClick={() => {
          console.log(nowCount);
          console.log(value.minimum_attendance);
          if (nowCount >= value.minimum_attendance) {
            onClick();
          } else {
            console.log('you not enuough!!!');
          }
        }}
      >
        <div> id : {value.id}</div>
        <div> 가격 : {value.price}</div>
        <div> 좌석 : {value.seat}</div>
        <div> 최소출석일수 : {value.minimum_attendance}</div>
        <div> 티켓 발급 상태 : {value.ticket_is_used ? '발급' : '미발급'}</div>
      </div>
    );
  }
}

export default OneTicketThumb;
