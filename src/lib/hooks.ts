import { auth } from "@/auth";
import { usePathname } from "@/navigation";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";

export function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // A function that increment 👆🏻 the previous state like here 
    // is better than directly setting `setValue(value + 1)`
}

export const useCurrentSession = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [status, setStatus] = useState<string>("unauthenticated");
    const pathName = usePathname();
  
    const retrieveSession = useCallback(async () => {
      try {
        setStatus("loading");
        const sessionData = await getSession();
  
        if (sessionData) {
          setSession(sessionData);
          setStatus("authenticated");
          return;
        }
  
        setStatus("unauthenticated");
      } catch (error) {
        setStatus("unauthenticated");
        setSession(null);
      }
    }, []);
  
    useEffect(() => {
      retrieveSession();
  
      // use the pathname to force a re-render when the user navigates to a new page
    }, [retrieveSession, pathName]);
  
    return { session, status };
  };