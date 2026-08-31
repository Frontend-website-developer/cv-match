CV Match

An AI-powered tool that analyses a CV against a job description and returns a match score, a breakdown of matching and missing skills, and a written verdict explaining the result.

Live: cvmatch.syedsajidali.dev

<!-- TODO: add your screenshot here. Put the image in a /screenshots folder and reference it: ![CV Match result](screenshots/result.png) -->
Why I built this

I was applying for roles in Doha and kept running into the same problem: reading a long job description and trying to judge, honestly, whether I was a fit. It is slow, and it is easy to fool yourself in either direction — talking yourself out of a role you could do, or applying for one where a required skill is simply missing.

One rejection made the gap obvious. The job description listed several essential requirements I did not have, and I had spent an evening writing an application anyway. So I built the tool I wanted: something that reads both documents and tells you plainly where you stand.

What it does

You paste your CV and a job description. The application returns:

A match score out of 100
A summary — a short, direct verdict on the fit
Matching skills — what the CV demonstrates that the role asks for
Missing skills — what the role requires that the CV does not show
Tech stack
Layer	Choice
Framework	Next.js (App Router)
Language	TypeScript
Styling	Tailwind CSS
AI	Anthropic Claude API
Hosting	Vercel

The model call runs server-side in a Next.js API route, so the API key never reaches the browser.

The interesting part: making an LLM behave predictably

The UI here is straightforward. The real engineering is in getting consistent, parseable output from a model that is non-deterministic by design. Four things made the difference.

An explicit scoring rubric

Without one, the model invents its own standard on every call — the same CV and job description can score 45 one minute and 70 the next. The system prompt defines score bands and what each means, so the model applies a fixed scale rather than a mood.

Judging only what is stated

Language models are eager to be helpful, and that shows up as inferring skills the candidate never claimed. React does not imply React Native. A mention of an API does not imply production experience with it. The prompt instructs the model to evaluate only what the CV explicitly states, which makes the "missing skills" list far more honest — and honesty is the entire point of the tool.

Constrained output

The model is given an exact JSON shape to return, described in the request rather than left to inference. This is what turns a paragraph of prose into something the interface can render as a score bar and two columns.

Defensive parsing

Even with clear instructions, models occasionally wrap JSON in markdown fences or open with a sentence of preamble. Rather than trusting the happy path, the response is cleaned before parsing, and the parsed object is normalised against an expected shape so a missing key never crashes the UI.

The lesson I took from this: prompt design is not a prelude to the engineering, it is the engineering. Most of the iteration on this project happened in the system prompt, not the React.

Development workflow

This project also served as practice for continuous delivery, alongside a DevOps course I was taking.

Each feature was developed on its own branch
Changes merged through pull requests rather than pushed to main
Every pull request produced its own preview deployment for verification
Merges to main deploy automatically to Vercel

Nothing here is complex, but it meant main stayed deployable throughout and every change was verifiable in a real environment before it went live.

Running locally
bash
git clone https://github.com/Frontend-website-developer/cv-match.git
cd cv-match
npm install

Create a .env.local file in the project root:

ANTHROPIC_API_KEY=your_key_here

You can get a key from console.anthropic.com.

bash
npm run dev

Open http://localhost:3000.

What's next

Known gaps, in rough priority order:

PDF upload — the CV is pasted as text today. Server-side extraction would remove an obvious friction point.
Input validation — empty or nonsense submissions currently reach the model.
Error handling — rate limits and API failures need to surface as something useful rather than a broken state.
Severity on missing skills — distinguishing a deal-breaker from a nice-to-have would make the output more actionable.
Cover letter generation — feeding the analysis back in as context to draft a letter that addresses the real gaps rather than ignoring them.
Author

Syed Sajid Ali — Senior Full Stack Developer, Doha

Portfolio · LinkedIn · GitHub
