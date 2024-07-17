/* eslint-disable @next/next/no-img-element */
'use client'
import { Input } from '@/components/ui/input';
import { createStyles } from '@mantine/core';
import Image from 'next/image';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { BiSolidChat } from "react-icons/bi";
import { TiCancelOutline } from "react-icons/ti";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import {  useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Cookies from "js-cookie";
import hubspotService from '@/services/hubspotService';
import chatbotService from '@/services/chatbotService';
import Loader from '@/components/loader/Loader';

interface HubspotConversationsContextType {
  toggleWidget: () => void;
  isOpen: boolean;
}

const HubspotConversationsContext =
  createContext<HubspotConversationsContextType | null>(null);

const HUBSPOT_INLINE_EMBED_ELEMENT_ID =
  'hubspot-conversations-inline-embed-selector';

export const HubspotConversationsProvider = ({ children }: { children?: ReactNode }) => {

  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(false)
  // AskEmail Stage
  const botDefaultMessage = "First of all, enter basis information to save your contact"
  const botChatflowMessage = "Choose the thread that you want to ask"
  const [askEmailStageCriteria, setAskEmailStageCriteria] = useState({
    isPassedEmail: false,
    email: '',
    visitorId: '',
    name: '',
    botMessage: botDefaultMessage
  })

  // ChatflowUI Stage
  const [chatflowUIStageCriteria, setChatflowUIStageCriteria] = useState<{ isPassed: boolean, chatflowChoosen: undefined | "AI" | "ASSISTANT" }>({
    isPassed: false,
    chatflowChoosen: undefined
  })
  interface ActorHubspotType {
    id: string, name: string, email: string, avatar: string, type: string
  }
  const [hubspotUser, setHubspotUser] = useState<{ aiUser?: ActorHubspotType, assistantUser?: ActorHubspotType }>({
    aiUser: undefined, assistantUser: undefined
  })

  const { classes } = useStyles(isOpen);

  const hideWidget = useCallback(() => {
    setIsOpen(false);
    setChatflowUIStageCriteria({ ...chatflowUIStageCriteria, isPassed: false, chatflowChoosen: undefined })
  }, [])

  const showWidget = useCallback(() => {
    if (!isReady) return;

    window.HubSpotConversations.widget.load();
    window.HubSpotConversations.widget.open();

    setIsOpen(true);
  }, [isReady])

  const toggleWidget = useCallback(() => {
    if (isOpen) {
      hideWidget();
    } else {
      showWidget();
    }
  }, [hideWidget, isOpen, showWidget]);

  const onConversationsReady = useCallback(() => {
    console.log("onConversationsReady")
    setIsReady(true)
  }, [])

  useEffect(
    function init() {
      if (window.HubSpotConversations) {
        onConversationsReady();
      } else {
        window.hsConversationsOnReady = [onConversationsReady];
      }
    },
    [onConversationsReady]
  )

  useEffect(
    function addEventListeners() {
      if (!isReady || !chatflowUIStageCriteria.chatflowChoosen) return;

      async function conversationStartedListener(payload: any) {
        // Handle First Message to get the AssignedTo
        if (chatflowUIStageCriteria.chatflowChoosen == "AI") {
          await chatbotService.getMessageResponse(
            payload.conversation.conversationId,
            "AI"
          )
        } else {
          await chatbotService.getMessageResponse(
            payload.conversation.conversationId,
            "ASSISTANT"
          )
        }
      }

      window.HubSpotConversations.on('conversationStarted', conversationStartedListener);

      return () => {
        window.HubSpotConversations.off('conversationStarted', conversationStartedListener)
      }
    },
    [isReady, chatflowUIStageCriteria.chatflowChoosen]
  );

  useEffect(
    function refreshConversationsOnRouteChange() {
      if (!isReady) return

      window.HubSpotConversations.widget.refresh()
      console.log("Conversation Refreshed")
    },
    [isReady]
  )

  // Ask Email State


  // Handle before load
  useEffect(() => {
    setTimeout(async () => {
      // In this case, hubspoutk required in cookie.
      const hubspotutk = Cookies.get('hubspotutk') as string

      const contactOfUTK = await hubspotService.getContactByHuspotUtk(hubspotutk)
      if (contactOfUTK.vid) {
        const vid = contactOfUTK["vid"]
        const identities = contactOfUTK["identity-profiles"][0]["identities"] as Array<object>
        const emailPrimary = identities.find((identity: any) => identity.type == "EMAIL" && identity["is-primary"] !== undefined)
        if (identities.length > 0 && emailPrimary) { // Check this one
          window.hsConversationsSettings = {
            ...window.hsConversationsSettings,
            identificationEmail: askEmailStageCriteria.email,
          };
          window.HubSpotConversations.widget.load()
          window.HubSpotConversations.widget.refresh()
          setAskEmailStageCriteria({ ...askEmailStageCriteria, isPassedEmail: true, botMessage: botChatflowMessage, visitorId: vid })
        }
      }
    }, 1000)
  }, []);


  // Handle AskEmailStageSchema If hubSpotUTK doesn't contain any thing meaning first time.
  const AskEmailStageSchema = z.object({
    email: z.string({
      invalid_type_error: "Your email must be valid string"
    }).email({
      message: "Your email is invalid!!!"
    }),
    name: z.string().min(1, {
      message: "You need to enter your name"
    })
  })

  const form = useForm<z.infer<typeof AskEmailStageSchema>>({
    resolver: zodResolver(AskEmailStageSchema),
    defaultValues: {
      email: "",
      name: ""
    }
  })


  const onAskEmailStageSubmit = (values: z.infer<typeof AskEmailStageSchema>) => {
    const valueParse = AskEmailStageSchema.safeParse(values)
    if (valueParse.success) {
      setAskEmailStageCriteria({ ...askEmailStageCriteria, isPassedEmail: true, botMessage: botChatflowMessage })
      window.hsConversationsSettings = {
        ...window.hsConversationsSettings,
        identificationEmail: askEmailStageCriteria.email,
      };
      window.HubSpotConversations.widget.load();
    }
  }
  const onAskEmailStageError = (e: any) => { // Catch form clicked
    const { email, name } = e
    let message = ""
    if (email) {
      message = `<p>${email.message}</p>`
    }
    if (name) {
      message += `<p>${name.message}</p>`
    }
    setAskEmailStageCriteria({ ...askEmailStageCriteria, botMessage: message })
  }

  // Handle ChatflowUI Stage

  useEffect(() => {
    if (isOpen) {
      (async () => {
        setLoading(true)
        // The way set isShowChatflow always true except the remove thread behaviour from user system -> isShowChatflow not updated on that action.
        let isShowChatflow = (Cookies.get('isShowChatflow') == undefined || Cookies.get('isShowChatflow') == "true") ? true : false
        if (isShowChatflow) {
          isShowChatflow = await hubspotService.isShowChatflowUI({ visitorId: askEmailStageCriteria.visitorId })
        }

        if (!isShowChatflow) {
          setChatflowUIStageCriteria({ ...chatflowUIStageCriteria, isPassed: true })
          Cookies.set("isShowChatflow", "false")
          setLoading(false)
        } else {
          const AIUser = await hubspotService.getActor(process.env.NEXT_PUBLIC_HUSPOT_AI_ACTOR_ID as string)
          const AssistantUser = await hubspotService.getActor(process.env.NEXT_PUBLIC_HUSPOT_ASSISTANT_ACTOR_ID as string)
          setHubspotUser({ ...hubspotUser, aiUser: AIUser, assistantUser: AssistantUser })
          setLoading(false)
        }
      })();
    }
  }, [isOpen]);

  const handleChatflowChoosen = (chatflow: "AI" | "ASSISTANT") => {
    setChatflowUIStageCriteria({ ...chatflowUIStageCriteria, isPassed: true, chatflowChoosen: chatflow })
    window.history.pushState({}, `${(chatflow == "AI") ? 'talk_to_ai' : 'talk_to_assistant'
      }`, `${(chatflow == "AI") ? '?ai_chat=true' : '?assistant_chat=true'
      }`)
    window.HubSpotConversations.widget.refresh({ openToNewThread: true })
  }

  return (
    <HubspotConversationsContext.Provider
      value={{ isOpen, toggleWidget }}
    >
      {/* {children} */}
      <div className='fixed bg-transparent max-w-[30%] w-[30%] flex flex-col gap-y-2 duration-500 items-end bottom-5 transition-all right-3'>
        <div
          className={`${classes.chatWidgetContainer} ${(askEmailStageCriteria.isPassedEmail && chatflowUIStageCriteria.isPassed) ? "" : "hidden"}`}
          id={HUBSPOT_INLINE_EMBED_ELEMENT_ID}
        />
        <div className={`shadow-2xl h-[300px] min-w-[100%] bg-emerald-400 shadow-slate-500/50 rounded-lg flex flex-col gap-y-1 p-3 ${(isOpen) ? "" : "hidden"} ${(askEmailStageCriteria.isPassedEmail && chatflowUIStageCriteria.isPassed || isLoading) ? "hidden" : ""}`}>
          <div className='h-[80px] grid grid-cols-4  min-w-full'> {/* items-stretch justify-items-stretch */}
            <Image src='/chatbot.png' width={60} height={60} className='justify-self-end self-end animate-bounce animate-duration-2s animate-ease-in-out animate-infinite' alt='' />
            <div
              className="col-span-3 font-bold z-0 self-start relative text-base leading-6 w-fit  text-wrap p-2 bg-white rounded-md text-center 
            after:content-[''] after:w-0 after:h-0 after:absolute after:border-l-[18px] after:border-r-[6px] 
            after:border-t-[18px] after:border-b-[12px] after:border-l-white after:border-t-white after:rotate-12
            after:border-r-transparent after:-z-10 after:border-b-transparent after:left-[0px] after:bottom-[-10px]" dangerouslySetInnerHTML={{ __html: askEmailStageCriteria.botMessage }}></div>
          </div>
          <div className={`${(askEmailStageCriteria.isPassedEmail) ? "hidden" : ""}`}> {/* AskEmail Stage */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onAskEmailStageSubmit, onAskEmailStageError)}>
                <FormField control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{`Email:`}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={'example@gmai.com...'}
                          onChangeCapture={(e) => { setAskEmailStageCriteria({ ...askEmailStageCriteria, email: e.currentTarget.value }) }}
                          value={askEmailStageCriteria.email}
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                <FormField control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{`Name:`}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={'Mr. John...'}
                          onChangeCapture={(e) => { setAskEmailStageCriteria({ ...askEmailStageCriteria, name: e.currentTarget.value }) }}
                          value={askEmailStageCriteria.name}
                        />
                      </FormControl>
                    </FormItem>
                  )} />

                {/* <Label htmlFor='emailChatWidget' className='font-bold '>Email:</Label> */}
                {/* <Input id='emailChatWidget' className='min-w-full' placeholder='example@gmai.com...' onChange={(e) => { setAskEmailStageCriteria({ ...askEmailStageCriteria, email: e.target.value }) }} /> */}

                {/* <Label htmlFor='nameChatWidget' className='font-bold'>Name:</Label>
              <Input id='nameChatWidget' className='min-w-full' placeholder='Mr. John...' /> */}
                <button type='submit' className='mx-auto me-0 flex items-center'>
                  <p className='hover:underline-offset-2 hover:underline italic font-bold'>Next</p>
                  <RiArrowRightDoubleFill className='h-5 w-5 font-bold' />
                </button>
              </form>
            </Form>
          </div>
          <div className={`${(askEmailStageCriteria.isPassedEmail && !chatflowUIStageCriteria.isPassed) ? "" : "hidden"} flex flex-col gap-y-4`}> {/* Chaflow Choosen Stage */}
            <div className="w-full h-[50%] bg-white rounded-md shadow-md shadow-yellow-300  hover:cursor-pointer" onClick={() => handleChatflowChoosen("AI")}>
              <div className='flex shadow-inner shadow-slate-400 p-2 rounded-md'>
                <div className='basis-1/4'>
                  <img src={hubspotUser.aiUser?.avatar} className='w-[50%] rounded-full outline-emerald-200 outline' alt="" />
                </div>
                <div className=''>
                  <b>{hubspotUser.aiUser?.name}</b>
                </div>
              </div>
            </div>
            <div className="w-full h-[50%] bg-white rounded-md shadow-md shadow-yellow-300  hover:cursor-pointer" onClick={() => handleChatflowChoosen("ASSISTANT")}>
              <div className='flex shadow-inner shadow-slate-400 p-2 rounded-md'>
                <div className='basis-1/4'>
                  <img src={hubspotUser.assistantUser?.avatar} className='w-[50%] rounded-full outline-emerald-200 outline' alt="" />
                </div>
                <div className=''>
                  <b>{hubspotUser.assistantUser?.name}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className='' onClick={toggleWidget}>
          {
            (isOpen)
              ? <TiCancelOutline className='w-14 h-14 transition-all shadow-lg shadow-emerald-500/50 text-white hover:w-[60px] hover:h-[60px]  p-3 bg-emerald-400 rounded-full' />
              : <BiSolidChat className='w-14 h-14 transition-all shadow-lg shadow-emerald-500/50 text-white hover:w-[60px] hover:h-[60px]  p-3 bg-emerald-400 rounded-full' />
          }
        </button>
        <Loader show={isLoading} onClose={() => { }} />
      </div>
    </HubspotConversationsContext.Provider>
  );
};

const useStyles = createStyles((theme: any, isOpen: boolean) => ({
  chatWidgetContainer: {
    overflow: 'hidden',
    zIndex: 2147483647, // this is the max possible value
    height: 500,
    width: 376,
    display: isOpen ? 'block' : 'none',
    borderRadius: theme.radius.md,
    backgroundColor: 'white',
    boxShadow: '0 5px 20px rgb(0 0 0 / 10%)',

    '#hubspot-conversations-inline-parent': {
      width: '100%',
      height: '100%',
    },

    '#hubspot-conversations-inline-iframe': {
      width: '100%',
      height: '100%',
      border: 'none',
    },
  }
}));

export function useHubspotConversations() {
  const context = useContext(HubspotConversationsContext);

  if (context === null) {
    throw new Error(
      'useHubspotConversations must be used within HubspotConversationsProvider'
    );
  }

  return context;
}

declare global {
  interface Window {
    hsConversationsSettings: Record<string, any>;
    hsConversationsOnReady: Array<() => void>;
    HubSpotConversations: {
      on: any;
      off: any;
      widget: {
        status: () => { loaded: boolean; pending: boolean };
        load: (params?: { widgetOpen: boolean }) => void;
        remove: () => void;
        open: () => void;
        close: () => void;
        refresh: ({ openToNewThread }?: { openToNewThread: boolean }) => void;
      };
    };
  }
}

