import openai
from apps.leads.models import Setting, ChatMessage, Lead
import logging

logger = logging.getLogger(__name__)


class AIOrchestrator:
    """
    OpenAI GPT-3.5 based AI reply service.
    Generates Hinglish replies for WhatsApp CRM.
    """

    def get_client(self):
        api_key = Setting.get('openai_api_key')
        if not api_key:
            raise ValueError("OpenAI API key not configured. Settings mein add karo.")
        return openai.OpenAI(api_key=api_key)

    def process(self, lead_id: int, incoming_text: str) -> str | None:
        """
        Process an incoming WhatsApp message and return AI reply.
        Returns None if AI is disabled for this lead.
        """
        try:
            lead = Lead.objects.get(id=lead_id)
        except Lead.DoesNotExist:
            return None

        # Check if AI is enabled for this lead
        if not lead.ai_enabled:
            logger.info(f"AI disabled for lead {lead_id}, skipping")
            return None

        # Build conversation history (last 10 messages)
        history = ChatMessage.objects.filter(lead=lead).order_by('-timestamp')[:10]

        # Build system prompt
        biz_name = Setting.get('business_name', 'Hamara Business')
        custom_prompt = Setting.get('ai_system_prompt', '')

        if custom_prompt:
            system_prompt = custom_prompt
        else:
            system_prompt = (
                f"Tum {biz_name} ke helpful customer service assistant ho. "
                f"Hinglish mein baat karo (Hindi + English mix). "
                f"Short, friendly aur helpful replies do — max 3-4 sentences. "
                f"Professional tone rakho. Customer ki problem solve karne ki koshish karo. "
                f"Agar kuch nahi pata toh honestly batao aur agent se milwane ka offer karo."
            )

        messages = [{'role': 'system', 'content': system_prompt}]

        # Add conversation history
        for msg in reversed(history):
            role = 'user' if msg.role == 'user' else 'assistant'
            messages.append({'role': role, 'content': msg.content})

        # Add current message
        messages.append({'role': 'user', 'content': incoming_text})

        try:
            client = self.get_client()
            response = client.chat.completions.create(
                model='gpt-3.5-turbo',
                messages=messages,
                max_tokens=200,     # Keep replies short — cost control
                temperature=0.7,
                timeout=8,
            )
            reply = response.choices[0].message.content.strip()
            logger.info(f"AI reply generated for lead {lead_id}: {reply[:50]}...")
            return reply

        except openai.APIConnectionError:
            logger.error("OpenAI connection failed")
            return "Abhi thoda busy hain, jald hi reply karenge! 🙏"

        except openai.RateLimitError:
            logger.error("OpenAI rate limit hit")
            return "Abhi thoda busy hain, jald hi reply karenge! 🙏"

        except Exception as e:
            logger.error(f"AI error: {e}")
            return "Abhi thoda busy hain, jald hi reply karenge! 🙏"


# Singleton instance
ai_service = AIOrchestrator()
