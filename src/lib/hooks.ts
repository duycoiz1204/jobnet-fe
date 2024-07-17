import React, { useRef } from "react";
import { useState } from "react";

export function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // A function that increment 👆🏻 the previous state like here 
    // is better than directly setting `setValue(value + 1)`
}

// const useHubspotChat = (portalId: string) => {
//     const [ hasLoaded, setHasLoaded ] = useState(false);
//     const [ activeConversation, setActiveConversation ] = useState(false);
//     const eventRef = useRef(null);
    
//     React.useEffect(() => {
//       console.log('hey')
      
//       // Add event listener.
//       window.hsConversationsOnReady = [() => {
//         setHasLoaded(true);
//       }];
     
//       // Create script component.
//       let script = document.createElement('script');
//       script.src=`//js.hs-scripts.com/${portalId}.js`;
//       script.async = true;
      
//       document.body.appendChild(script);
      
//       return () => {
//         document.body.removeChild(script);
//         window.hsConversationsOnReady = [];
//       }
      
//     }, []);
    
//     // Subscripe to conversation events.
//     useEffect(() => {
//       eventRef.current = (payload) => {
//         setActiveConversation(payload.conversation.conversationId);
//       }
     
//       if (hasLoaded) {
//         window.HubSpotConversations.on( 'conversationStarted', eventRef.current);
//       }
      
//       return () => {
//         window.HubSpotConversations.off('conversationStarted', eventRef.current);
//       }
      
//     }, [hasLoaded]);
    
//     const openHandler = React.useCallback(() => {
//       if (hasLoaded) {
//         window.HubSpotConversations.widget.open();
//       }
//     }, [hasLoaded]);
    
//     const closeHandler = React.useCallback(() => {
//       if (hasLoaded) {
//         window.HubSpotConversations.widget.close();
//       }
//     }, [hasLoaded])
    
//     return {
//       hasLoaded, 
//       activeConversation,
//       openHandler,
//       closeHandler
//     };
//   }