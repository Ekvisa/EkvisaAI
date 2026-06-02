import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

console.log("EMAIL FILE VERSION 2");
console.log(process.env.RESEND_API_KEY);

export async function sendIdeaEmail(to, idea) {
  console.log("Отправляем письмо");
  const resend = new Resend(process.env.RESEND_API_KEY);
  return await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: [to, "katishh@gmail.com"],
    subject: "💡 Идея проекта от Ekvisa",
    html: `
      <h2>Идея проекта</h2>
      <p><b>${idea.idea}</b></p>

      <h3>Описание</h3>
      <p>${idea.description}</p>

      <h3>Почему это работает</h3>
      <p>${idea.why_it_works}</p>

      <h3>Стек</h3>
      <ul>
        ${idea.stack.map((s) => `<li>${s}</li>`).join("")}
      </ul>

      <hr />
      <p style="color: gray;">
        Сгенерировано Ekvisa AI 💫
      </p>
    `,
  });
}
