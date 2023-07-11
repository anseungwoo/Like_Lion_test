import { TailSpin } from 'react-loader-spinner';
export default function Loding() {
  return (
    <TailSpin
      height="500"
      width="500"
      color="#9f9f9f"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  );
}
