import { TailSpin, Blocks } from 'react-loader-spinner';
export function Loding() {
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

export function BlockLoding() {
  return (
    <Blocks
      visible={true}
      height="80"
      width="80"
      ariaLabel="blocks-loading"
      wrapperStyle={{}}
      wrapperClass="blocks-wrapper"
    />
  );
}
