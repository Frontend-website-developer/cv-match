"use client";

import { useState } from "react";

export default function Home() {
  const[cv, setcv] = useState("");
  const[jd, setjd] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
  const handleSubmit = async function(e: React.FormEvent){
    e.preventDefault();
    setLoading(true);
    try{
      const res = await fetch("/api/match", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({cv, jd}),
    })
    const data= await res.json();
    setResult(data);
    }
    catch(err){
      setError(`there is an error ${err}`)
    }
    finally{
      setLoading(false)
    }
    
  }
  return (
    <main className="min-h-screen items-center justify-center p-8">
      <div className="text-center pt-4">
        <h1 className="text-4xl font-bold mb-4">CV Match</h1>
        <p className="text-lg text-gray-600">
          Upload your CV, paste a job description, and see how well you match.
        </p>

<form className="bg-[#f6f3f6] p-5 py-6 mt-4" onSubmit={handleSubmit}>
  <div className="md:flex  radius-md md:justify-between">
    <textarea className="p-2 border bg-white w-[48%] rounded-md border-[#f2f2f2] focus:border-[#ccc] min-h-[500px]" value={cv} placeholder="Enter Your Cv" onChange={(e) => setcv(e.target.value)}></textarea>
    <textarea className="p-2 border bg-white w-[48%] rounded-md border-[#f2f2f2] focus:border-[#ccc]" value={jd} placeholder="Enter JD" onChange={(e) => setjd(e.target.value)}></textarea>
  </div>
    <button className="bg-green-500 hover:bg-green-700 rounded-md px-3 py-2 text-[#fff] mt-5" disabled={loading} type="submit">Submit</button>
</form>
<p>{loading ? "Analyzing" : ""}</p>
<p>{error? error : ""}</p>
      </div>
    </main>
  );
}