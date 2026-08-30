"use client";
import { z } from "zod";

import { MatchResultSchema } from "@/lib/schemas";

import { useState } from "react";
import { useEffect } from "react";

import { Check, X } from "lucide-react";

type MatchResult = z.infer<typeof MatchResultSchema>;







export default function Home() {

  function getBarColor(pct: number) {
  if (pct < 50) return "bg-red-500 text-red-500";
  if (pct < 70) return "bg-yellow-500 text-yellow-500";
  return "bg-green-500 text-green-500";
}

  const [result, setResult] = useState<MatchResult | null>(null);
  useEffect(() => {
  if(result){
    const timer = setTimeout(() => setBarWidth(result.matchPercentage), 50);
    return () => clearTimeout(timer);
  } else {
    setBarWidth(0);
  }
}, [result]);
  const [barWidth, setBarWidth] = useState(0);
  const[cv, setcv] = useState("");
  const[jd, setjd] = useState("");
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
      <div className={result ? "fixed inset-0 z-50 bg-black/50 flex items-center justify-center" : ""}></div>
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


{result &&
<div className="text-left absolute z-99 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md border border-[#fefefe] p-4 w-[70%] max-h-[500px] overflow-y-scroll text-[14px]">
  <h2 className="text-[24px] font-bold">CV Matching Result</h2>
<div className="flex gap-4 w-[200px] mt-3">
  <div className={`h-3 rounded-full transition-all duration-1000 ease-out w-[60%] bg-[#ccc]`}>
  <div 
    className={`h-3 rounded-full transition-all duration-1000 ease-out ${getBarColor(result.matchPercentage)}`}
    style={{ width: `${barWidth}%` }}
  /></div><p className={`font-bold leading-[12px] ${getBarColor(result.matchPercentage)} bg-transparent!`}>{result.matchPercentage} %</p>
</div>
<h3 className="mt-4 text-left font-bold text-[20px]">Summary</h3>

{result?.summary}
<div className="md:flex">
  <div>
<h3 className="mt-4 text-left font-bold text-[20px]">Matching Skills</h3>
<ul className="list-disc list-inside">
  {result?.matchedSkills.map((match) => {
    return (
    <li className="flex items-center gap-1 my-2">
  <Check className="w-4 h-4 text-green-600" /> {match}
</li>
    )
  })}
</ul>
</div>
<div>
<h3 className="mt-4 text-left font-bold text-[20px]">Skills Which Are Lacking</h3>

<ul className="list-disc list-inside">
  {
    result.missingSkills.map((match) => {
      return (
      <li className="flex items-center gap-1 my-2">
  <X className="w-4 h-4 text-red-600" /> {match}
</li>
      )
    })
  }
</ul>
</div></div>
</div>
}



      </div>
    </main>
  );
}