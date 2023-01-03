import React, { useState } from "react";
import { auth } from "../auth/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../auth/config";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // after creating an account with firebase, store the id in the database /api/signup
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password === "" || confirmPassword === "") {
      alert("Please enter all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = result.user;

      const res = await signInWithEmailAndPassword(auth, email, password);

      // Create a document inside "users" collection with the user's id
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        name,
      });

      console.log(res);

      alert("Account created successfully");
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className="signup">
      <h1>Signup</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-wrapper">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-wrapper">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-wrapper">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-wrapper">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit">Signup</button>

        <div className="login-suggestion">
          Already have an account?
          <Link href="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
