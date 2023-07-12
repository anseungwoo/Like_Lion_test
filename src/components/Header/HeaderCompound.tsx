'use client';
import React, { FC, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import './HeaderStyles.css';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { AppContext } from '@/app/layout';
import { useTicketProjectList } from '@/context/contractContext';
import { OneProject } from '@/domain/OneProject';
import { onClickLogin } from '@/utils/web3/web3_v2';
import LoginDialog from '@/compounds/Redirect';
interface HeaderProps {
  className?: string;
  children?: ReactNode;
}

const HeaderCustom: FC<HeaderProps> = () => {
  const { account, setAccount } = useContext(AppContext);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const clickWalletLogin = async () => {
    const walletAddr = await onClickLogin();

    if (walletAddr !== null) {
      setAccount(walletAddr);
    }
  };

  const { getProject, projects } = useTicketProjectList();

  useEffect(() => {
    const temp: OneProject | null = getProject('1234');
    console.log(temp);
  }, [projects]);

  return (
    <div className="header_inner  ">
      <header className="header-wrapper-home inner">
        <nav className="navbar-home">
          <Link href="/">
            <Image
              className="logo"
              src={`/images/logo3.png`}
              width={100}
              height={50}
              alt=""
            />
          </Link>

          <Link href="/project">
            <div className="header-menu-item">프로젝트</div>
          </Link>
          {account ? (
            <Link href="/profile">
              <div className="header-menu-item">프로필</div>
            </Link>
          ) : (
            <>
              <button
                className="header-menu-item"
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                프로필
              </button>
              <LoginDialog
                title="프로필 페이지는"
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
              ></LoginDialog>
            </>
          )}
        </nav>
        {account ? (
          <div className="connect-wallet-button">
            {account.substring(0, 4)}...{account.substring(account.length - 4)}
          </div>
        ) : (
          <button className="connect-wallet-button" onClick={clickWalletLogin}>
            Connect Wallet
          </button>
        )}
      </header>
    </div>
  );
};

export default HeaderCustom;
