import BaseService from './baseService';

class ChatbotService extends BaseService {
    private chatbotBaseUrl = `${process.env.NEXT_PUBLIC_CHATBOT_BASE_URL}/api/hubspot`;

    async getMessageResponse(threadId: string, sender: "AI" | "ASSISTANT") {

        const url = `${this.chatbotBaseUrl}`
        
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                threadId,
                sender: sender
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        this.checkResponseNotOk(res);
    }
}

const chatbotService = new ChatbotService();
export default chatbotService