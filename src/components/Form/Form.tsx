import { useState, type FormEvent } from "react";
import ekvisa from "../../assets/girl.svg";

type IdeaResponse = {
  idea: string;
  description: string;
  why_it_works: string;
  stack: string[];
};

function Form() {
  const [idea, setIdea] = useState<IdeaResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const interests = String(formData.get("interests") ?? "");
    const technologies = String(formData.get("technologies") ?? "");
    const email = String(formData.get("email") ?? "");
    console.log(email);
    console.log(technologies);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/generate-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interests,
          technologies,
          email,
        }),
      });

      const data: IdeaResponse = await response.json();

      setIdea(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form">
      <img src={ekvisa} alt="ekvisa" />
      <p>
        Привет, я Ekvisa. <br />
        Люблю придумывать пет-проекты.
        <br />
        Иногда они остаются просто идеями, иногда превращаются в код, а иногда
        начинают жить своей жизнью.
        <br />
        Мои пет-проекты - это любимые питомцы, которые учат новому и позволяют
        играть и творить.
        <br />
        Говорят, я генератор идей. Возможно, это правда.
        <br />
        Хочешь сенерировать идею для проекта? Опиши свои интересы и технологии,
        и давай посмотрим, что получится!
      </p>

      <form onSubmit={handleSubmit}>
        <textarea name="interests" placeholder="Interests" />

        <textarea name="technologies" placeholder="Technologies" />

        <input
          name="email"
          type="email"
          placeholder="Email для отправки идеи"
        />

        <button disabled={loading}>
          {loading ? "Ekvisa думает..." : "Сгенерировать идею"}
        </button>
      </form>

      {idea && (
        <section>
          <h2>{idea.idea}</h2>

          <p>{idea.description}</p>

          <p>{idea.why_it_works}</p>

          <ul>
            {idea.stack?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default Form;
