import BaseService from './baseService';
import Cookies from "js-cookie";

class HuspotService extends BaseService {
    private contactBaseUrl_v1 = `${process.env.NEXT_PUBLIC_HUSPOT_API_URL}/contacts/v1/contact`;
    private conversationBseUrl_v3 = `${process.env.NEXT_PUBLIC_HUSPOT_API_URL}/conversations/v3/conversations`;

    async getActor(actorId: string) {

        const url = `${this.conversationBseUrl_v3}/actors/${actorId}`
        
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUSPOT_TOKEN}`,
            },
        });
        await this.checkResponseNotOk(res);
        return this.getResponseData<any>(res);
    }

    async getContactByHuspotUtk(hubspotUtk: string) {

        const url = `${this.contactBaseUrl_v1}/utk/${hubspotUtk}/profile`
        
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUSPOT_TOKEN}`,
            },
        });
        if (res.status == 404) {
            console.log("HubspotURK 404: ", hubspotUtk);
            
            const huspotCookieNeedTobeRemoved = ['__hstc', 'hubspotutk', '__hssc', '__hssrc', 'messagesUtk', 'isShowChatflow'] // __hstc & hubspotutk was enough. 
            huspotCookieNeedTobeRemoved.forEach(cook => {
                Cookies.remove(cook)
            })  
           return window.location.reload()
        }
        await this.checkResponseNotOk(res);
        return this.getResponseData<any>(res);
    }
    async getThreads(props: {
        associatedContactId?: string
    }) {

        const params = new URLSearchParams();

        props.associatedContactId && params.append("associatedContactId", props.associatedContactId)

        const url = `${this.conversationBseUrl_v3}/threads?${params.toString()}`
        
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUSPOT_TOKEN}`,
            },
        })
        await this.checkResponseNotOk(res);
        return this.getResponseData<any>(res);
    }

    async getMessagesFromConversation(threadId: string) {

        const url = `${this.conversationBseUrl_v3}/threads/${threadId}/messages?limit=5`
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUSPOT_TOKEN}`,
          }
        })
    
        await this.checkResponseNotOk(res);
    
        const resData = await this.getResponseData<any>(res)
    
        return resData.results
          .filter((message: any) => message.type == "MESSAGE" && message.text != undefined)
          .map((message: any) => {
            return {
              id: message.id,
              createdBy: message.createdBy,
              text: message.text
            }
          });
      }

    async isShowChatflowUI(props: {
        visitorId: string
    }) {
        // Show if: 0 thread, n Ai Bot Thread - 0 assistant thread 
        // Hide if: n Ai Bot Thread - 1 assitant Thread.
        let isHadAIBot = false
        let isHadAssistant = false
        const {results: threads} = await this.getThreads({associatedContactId: props.visitorId}) as any
        for (let thread of threads) {
            if (thread["assignedTo"] !== undefined && thread["assignedTo"] === process.env.NEXT_PUBLIC_HUSPOT_ASSISTANT_ACTOR_ID) {
                isHadAssistant = true
            }else {
                const messages = await this.getMessagesFromConversation(thread["id"])
                const messageAssistant = messages.find((message: any) => (message.createdBy as string) === process.env.NEXT_PUBLIC_HUSPOT_ASSISTANT_ACTOR_ID)
                const messageAI = messages.find((message: any) => (message.createdBy as string) === process.env.NEXT_PUBLIC_HUSPOT_AI_ACTOR_ID)
                if (messageAI) isHadAIBot = true
                if (messageAssistant) isHadAssistant = true
            }
            if (isHadAssistant && isHadAIBot) { break }
        }
        if (isHadAssistant && isHadAIBot) {
            return false
        }
        return true
    }
}

const hubspotService = new HuspotService();
export default hubspotService