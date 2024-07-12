"use client";
import React, {
  createContext,
  type Dispatch,
  JSX,
  type SetStateAction,
  useContext,
  useState,
} from "react";

interface Props {
  children?: React.ReactNode;
}

export type GlobalContextType = {
  msgCount: number;
  setMsgCount: Dispatch<SetStateAction<number>>;
};

// create context
export const GlobalContext = createContext<GlobalContextType>({
  msgCount: 0,
  setMsgCount: () => {},
});

// create provider
export const GlobalContextProvider = ({ children }: Props): JSX.Element => {
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  return (
    <GlobalContext.Provider
      value={{
        msgCount: unreadMsgCount,
        setMsgCount: setUnreadMsgCount,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// create a custom hook to access context
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
