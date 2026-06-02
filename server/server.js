import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import { sendIdeaEmail } from "./email.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // превращает JSON в объект

app.post("/api/generate-idea", async (req, res) => {
  const { interests, technologies, email } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-oss-120b:free",
        temperature: 0.8,
        messages: [
          {
            role: "system",
            content: `
            Придумай один проект, который:
            1. напрямую использует эти интересы;
            2. требует использования этих технологий;
            3. имеет понятную пользу;
            4. отличается от типичных todo-list, weather-app и chat-app.

            Верни ТОЛЬКО JSON с такой схемой:
            {
              "idea": "string",
              "description": "string",
              "why_it_works": "string",
              "stack": ["string"]
            }

            Условия:
            - значения в JSON на русском языке,
            - без markdown,
            - без объяснений,
            - без вставок кода,
            `,
          },
          {
            role: "user",
            content: `
            Интересы: "${interests}"
            Технологии: ${technologies}
            `,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const text = response.data.choices[0].message.content;

    let json;

    try {
      json = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("No JSON found in response");
      }
      json = JSON.parse(match[0]);
    }

    //Отправка email:
    if (email) {
      console.log("Отправляем письмо:", email);

      const result = await sendIdeaEmail(email, json);

      console.log("RESEND RESULT:");
      console.log(result);
    }

    res.json(json);
  } catch (err) {
    console.error("AI ERROR:");
    console.error(err);

    return res.status(500).json({
      error: "Не удалось получить ответ от ИИ",
    });
  }
});

app.get("/api/test", (req, res) => {
  res.json({ ok: true });
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
