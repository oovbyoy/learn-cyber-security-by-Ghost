import Head from "next/head";
import "../styles/globals.css";

export default function Team() {
  return (
    <>
      <Head><title>Zalm AI - Team</title></Head>
      <div className="centerPage">
        <div className="card">
          <h1>Our Team</h1>
          <ul>
            <li><b>Mansour</b> - Student</li>
            <li><b>Abdulaziz Al-Maliki</b> - Teacher</li>
            <li><b>Eid Nawaf</b> - Developer</li>
          </ul>
          <a href="/" className="link">← Back to Login</a>
        </div>
      </div>
    </>
  );
}