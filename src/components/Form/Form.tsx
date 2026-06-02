import { useState, type FormEvent } from "react";

type IdeaResponse = {
  idea: string;
  description: string;
  why_it_works: string;
  stack: string[];
};

function Form() {
  //   const [interests, setInterests] = useState("");
  //   const [technologies, setTechnologies] = useState("");

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
    <>
      <h1>Ekvisa</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          name="interests"
          placeholder="Interests"
          //   value={interests}
          //   onChange={(e) => setInterests(e.target.value)}
        />

        <textarea
          name="technologies"
          placeholder="Technologies"
          //   value={technologies}
          //   onChange={(e) => setTechnologies(e.target.value)}
        />

        <input
          name="email"
          type="email"
          placeholder="Email для отправки идеи"
          //   value={email}
          //   onChange={(e) => setEmail(e.target.value)}
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
    </>
  );
}

export default Form;
