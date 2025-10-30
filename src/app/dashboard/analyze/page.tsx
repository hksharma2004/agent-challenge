"use client"

import { useState } from "react"
import { TopNavBar } from "@/components/navigation/TopNavBar";
import Link from "next/link"
import { motion } from "framer-motion";
import {
  Code2,
  Bell,
  LogOut,
  ArrowRight,
  Github,
  AlertTriangle,
  Loader2,
  Sparkles,
  FileText,
  Shield, 
  FlaskConical, 
  BookOpen, 
} from "lucide-react"
import CodeHealthMetricsDisplay from "@/components/analysis/CodeHealthMetricsDisplay";
import AnalysisResultCard from "@/components/analysis/AnalysisResultCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type AnalysisWorkflowResult = {
  codeQuality?: string;
  documentation?: string;
  testing?: string;
  security?: string;
  summary?: string;
  primaryLanguage?: string;
  formattedContent?: string;
  success?: boolean;
  error?: string;
};

type ReaderWorkflowResult = {
  files?: Array<{ path: string; content: string }>;
  content?: string;
  fileCount?: number;
  success?: boolean;
  error?: string;
};

type CombinedAnalysisResult = {
  analysis: AnalysisWorkflowResult;
  reader: ReaderWorkflowResult;
};

export default function AnalyzePage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [githubPat, setGithubPat] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [combinedResult, setCombinedResult] = useState<CombinedAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.0 } },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setCombinedResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, githubPat }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result: CombinedAnalysisResult = await response.json();
      setCombinedResult(result);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNavBar />
      <main className="mx-auto max-w-5xl px-8 md:px-16 py-10">

        <motion.section
          className="mt-10 text-center"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="mb-4 text-4xl font-bold text-black inline-flex items-center gap-2">
            Code Analyzer Agent <Sparkles className="h-8 w-8 text-green-500" />
          </h1>
          <p className="text-lg text-neutral-600">
            Submit a public GitHub repository to receive an <span className="text-green-500">AI-powered analysis</span>.
          </p>
        </motion.section>


        <motion.section
          className="mt-10"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div className="mx-auto max-w-2xl rounded-xl border border-neutral-200 bg-neutral-50 p-8 shadow-sm hover:shadow-md transition-all duration-300">
            <form onSubmit={handleSubmit} aria-label="Code Analysis Form" className="space-y-6">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <Github className="h-6 w-6 text-neutral-600 flex-shrink-0" aria-hidden="true" />
                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/example/repo"
                  required
                  aria-label="GitHub Repository URL"
                  className="h-12 w-full rounded-md border border-neutral-300 bg-white px-4 text-black placeholder:text-neutral-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 outline-none transition-all duration-300"
                />
              </div>
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <Code2 className="h-6 w-6 text-neutral-600 flex-shrink-0" aria-hidden="true" />
                <input
                  type="password"
                  value={githubPat}
                  onChange={(e) => setGithubPat(e.target.value)}
                  placeholder="GitHub Personal Access Token (optional for private repos)"
                  aria-label="GitHub Personal Access Token"
                  className="h-12 w-full rounded-md border border-neutral-300 bg-white px-4 text-black placeholder:text-neutral-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 outline-none transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                aria-live="polite"
                aria-busy={isLoading}
                className="w-full flex items-center justify-center rounded-full bg-green-500 px-6 py-3 text-lg font-bold text-white shadow-sm hover:bg-green-600 disabled:bg-neutral-300 disabled:text-neutral-600 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" aria-hidden="true" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Repository"
                )}
              </button>
            </form>
          </div>
        </motion.section>

        {isLoading && !combinedResult && !error && (
          <motion.div
            className="mx-auto max-w-2xl my-20 rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center shadow-sm"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Loader2 className="h-10 w-10 text-green-500 animate-spin mx-auto mb-4" aria-hidden="true" />
            <p className="text-xl text-neutral-600">Analysis in progress, please wait...</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="mx-auto max-w-2xl my-20 rounded-xl border border-red-300 bg-red-50 p-8 flex items-start gap-4 shadow-sm" role="alert"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-red-700 text-lg">Analysis Failed</h3>
              <p className="text-red-600 mt-2">{error}</p>
            </div>
          </motion.div>
        )}

        {!isLoading && !combinedResult && !error && (
          <motion.div
            className="mx-auto max-w-2xl my-20 rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center shadow-sm"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <p className="text-lg text-neutral-600 italic">Enter a GitHub repository URL above to start the analysis.</p>
          </motion.div>
        )}

        {combinedResult && (
          <>

            <motion.section
              className="my-20 opacity-0 animate-fade-in transition-opacity duration-700 ease-out"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm uppercase text-neutral-500 font-semibold mb-2 text-center">
                &mdash; AI Summary &mdash;
              </p>
              <h2 className="mb-10 text-center text-4xl font-bold text-black">
                Analysis Results
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                <AnalysisResultCard title="Code Quality" content={combinedResult.analysis.codeQuality} icon={FileText} />
                <AnalysisResultCard title="Documentation" content={combinedResult.analysis.documentation} icon={BookOpen} />
                <AnalysisResultCard title="Testing" content={combinedResult.analysis.testing} icon={FlaskConical} />
                <AnalysisResultCard title="Security" content={combinedResult.analysis.security} icon={Shield} />
              </div>
            </motion.section>


            <motion.section
              className="my-20 opacity-0 animate-fade-in transition-opacity duration-700 ease-out"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-10">
                <div className="flex-1 border-t border-neutral-200" />
                <h2 className="text-center text-4xl font-bold text-black">Repository Contents</h2>
                <div className="flex-1 border-t border-neutral-200" />
              </div>
              <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
                {combinedResult.reader.files?.map((file, index) => (
                  <AccordionItem value={`item-${index}`} key={index} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                    <AccordionTrigger className="text-lg font-medium text-black hover:text-green-500 px-4 py-3 flex items-center gap-2">
                      {file.path.endsWith('.md') && <span className="text-neutral-500">📄</span>}
                      {file.path.endsWith('.py') && <span className="text-neutral-500">🐍</span>}
                      {file.path.endsWith('.yaml') && <span className="text-neutral-500">⚙️</span>}
                      {file.path}
                    </AccordionTrigger>
                    <AccordionContent>
                      <pre className="whitespace-pre-wrap break-all text-sm text-neutral-600 bg-neutral-100 p-4 rounded-b-md border border-t-0 border-neutral-200">
                        {file.content}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.section>


            <motion.section
              className="my-20 opacity-0 animate-fade-in transition-opacity duration-700 ease-out"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
            >
              <h2 className="mb-10 text-center text-4xl font-bold text-black">Code Health Metrics</h2>
              <CodeHealthMetricsDisplay />
            </motion.section>
          </>
        )}
      </main>
    </div>
  )
}
