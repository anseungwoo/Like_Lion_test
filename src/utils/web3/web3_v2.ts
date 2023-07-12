'use client';

import {
  GOERLI_CHAIN_ID,
  ethereum,
  questContract,
  web3,
  ticketContract,
} from '@/lib/web3.config';

export const onClickLogin = async () => {
  try {
    const accounts = await ethereum?.request({
      method: 'eth_requestAccounts',
    });
    console.log('onClickLogin');
    console.log(accounts);

    //  @ts-expect-error
    if (parseInt(ethereum?.networkVersion) !== GOERLI_CHAIN_ID) {
      await ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(GOERLI_CHAIN_ID) }],
      });
    }
    console.log('onClickLogin');
    //  @ts-expect-error
    console.log(accounts[0]);
    //  @ts-expect-error
    return accounts[0];
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const attendance = async (t_addr: string, account: string) => {
  try {
    //  @ts-expect-error
    const response = await questContract.methods.attendance(t_addr).send({
      from: account,
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const attendancePointCheck = async (t_addr: string, account: string) => {
  try {
    const response = await questContract.methods //  @ts-expect-error
      .attendancePointCheck(t_addr)
      .call({
        from: account,
      });
    return Number(response);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const ownerOfTokenId = async (t_addr: string, id: number) => {
  try {
    const response = await ticketContract(t_addr)
      .methods //  @ts-expect-error
      .ownerOf(id)
      .call();
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getMyLastTimeOfAttendance = async (
  t_addr: string,
  account: string
) => {
  try {
    const response = await questContract.methods //  @ts-expect-error
      .lastCheckedTime(t_addr)
      .call({
        from: account,
      });

    return Number(response);
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getWholeTicketContractList = async () => {
  try {
    const response = await questContract.methods
      .getWholeTicketContractsList()
      .call();
    return response;
    // console.log(ticketContractList);
    // console.log(ticketContractList[0]);
    //티컨만들어진 리스트중에 제일 첫번째꺼로 실험하기위해 유즈스테이트에 이렇게 등록해놧당
  } catch (error) {
    console.error(error);
    return [];
  }
};
export const ticketBuying = async (
  tokenId: number,
  price: number,
  t_addr: string,
  account: string
) => {
  try {
    const response = await questContract.methods //  @ts-expect-error
      .ticketTransfer(t_addr, tokenId)
      .send({
        from: account,
        value: web3.utils.toWei(price, 'wei'),
        //여기 10에 들어간 자리는 아래 내가 수동으로 프라이스 리스트 넣을때 1번토큰을 10wei로 했기때문이다
      });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

export const getTicketContractUri = async (t_addr: string) => {
  try {
    //여기서 티켓컨트랙트 주소가 정의 되어있어야한다 배포한 이후의 티켓 어드레스!! 컨트랙트(티컨주소,티컨abi)=ticketcontract
    const response = await ticketContract(t_addr).methods.uri1().call();
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getMyProjects = async (account: string) => {
  try {
    const response = await questContract.methods.getMyProjects().call({
      from: account,
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getMyTickets = async (t_addr: string, account: string) => {
  try {
    //여기서 티켓컨트랙트 주소가 정의 되어있어야한다 배포한 이후의 티켓 어드레스!! 컨트랙트(티컨주소,티컨abi)=ticketcontract
    const response = await ticketContract(t_addr)
      .methods.getUserTicketsInfo()
      .call({
        from: account,
      });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getWholeTicketList = async (t_addr: string) => {
  try {
    //여기서 티켓컨트랙트 주소가 정의 되어있어야한다 배포한 이후의 티켓 어드레스!! 컨트랙트(티컨주소,티컨abi)=ticketcontract
    const response = await ticketContract(t_addr)
      .methods.getAllTokenIdsConsideringSelling()
      .call();
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getWholeTicketNum = async (t_addr: string) => {
  try {
    //여기서 티켓컨트랙트 주소가 정의 되어있어야한다 배포한 이후의 티켓 어드레스!! 컨트랙트(티컨주소,티컨abi)=ticketcontract
    const response = await ticketContract(t_addr)
      .methods.getAllTokenIdsNumber()
      .call();
    return {
      //  @ts-expect-error
      whole: Number(response['0']), //  @ts-expect-error
      remain: Number(response['1']),
    };
  } catch (error) {
    console.error(error);
    return { whole: null, remain: null };
  }
};

export const makeTicketContract = async (
  tokenIds: number[],
  prices: number[],
  minCounts: number[],
  ticketNum: number,
  uri: string,
  name: string,
  symbol: string,
  account: string
) => {
  try {
    const response = await questContract.methods
      .makeTicketContract(
        //  @ts-expect-error
        tokenIds,
        prices,
        minCounts,
        ticketNum,
        uri,
        name,
        symbol
      )
      .send({
        from: account,
      });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const transactionTracking = async (
  targetTokenId: number,
  t_addr: string,
  targetReceiverAddress: string
) => {
  let transferCount = 0;
  let lastReceiver = null;

  const options = {
    filter: {
      tokenId: targetTokenId,
    },
    fromBlock: 0,
    toBlock: 'latest',
  };

  try {
    const events = await ticketContract(t_addr).getPastEvents(
      //  @ts-expect-error
      'Transfer',
      options
    );

    for (const event of events) {
      //  @ts-expect-error
      const { to, tokenId } = event.returnValues;

      if (tokenId == targetTokenId) {
        transferCount++;
        lastReceiver = to;
      }
    }

    if (transferCount >= 3) {
      return false;
    } else if (
      lastReceiver.toLowerCase() === targetReceiverAddress.toLowerCase() &&
      transferCount == 2
    ) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const processTicketUsing = async (
  t_addr: string,
  account: string,
  tokenId: number
) => {
  try {
    const response = await ticketContract(t_addr) //  @ts-expect-error
      .methods.ticketUsed(tokenId)
      .send({
        from: account,
      });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};
