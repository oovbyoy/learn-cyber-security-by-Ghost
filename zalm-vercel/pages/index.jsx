import { useRouter } from "next/router";
import Head from "next/head";
import "../styles/globals.css";

export default function Home() {
  const router = useRouter();

  function handleLogin(e) {
    e.preventDefault();
    const user = e.target.username.value.trim();
    const pass = e.target.password.value.trim();
    if (user === "admin" && pass === "123") {
      router.push("/chat");
    } else {
      alert("Wrong credentials — use admin / 123");
    }
  }

  return (
    <>
      <Head><title>Zalm AI - Login</title></Head>
      <div className="centerPage">
        <div className="card loginCard">
          <h1>Zalm <span className="accent">AI</span></h1>
          <form onSubmit={handleLogin}>
            <input name="username" placeholder="Username" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit" className="primary">Sign In</button>
          </form>
          <p className="hint">Try <b>admin</b> / <b>123</b></p>
          <p><a href="/team" className="link">View Team</a></p>
        </div>
      </div>
    </>
  );
}