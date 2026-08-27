import OpenAI from "openai";

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          error: "کلید هوش مصنوعی هنوز تنظیم نشده است."
        },
        {
          status: 500
        }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",

      messages: [
        {
          role: "system",
          content:
            "تو فروشنده هوشمند هستی. به زبان فارسی، واضح، کوتاه و کاربردی پاسخ بده. فعلاً این یک چت‌بات خام و قابل توسعه است."
        },

        ...messages
          .filter(
            (message) =>
              message.role === "user" ||
              message.role === "assistant"
          )
          .map((message) => ({
            role: message.role,
            content: message.content
          }))
      ]
    });

    const answer =
      completion.choices?.[0]?.message?.content ||
      "پاسخی دریافت نشد.";

    return Response.json({
      content: answer
    });

  } catch (error) {
    console.error("Chat error:", error);

    return Response.json(
      {
        error:
          "اتصال به هوش مصنوعی انجام نشد. تنظیمات پروژه را بررسی کنید."
      },
      {
        status: 500
      }
    );
  }
}
