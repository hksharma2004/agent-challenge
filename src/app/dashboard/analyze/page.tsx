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
  const [streamingEvents, setStreamingEvents] = useState<any[]>([]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.0 } },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setCombinedResult(null);
    setStreamingEvents([]);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, githubPat }),
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (isJson) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          const text = await response.text();
          console.error('Non-JSON error response:', text);
          errorMessage = text.substring(0, 100) || errorMessage;
        }
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResult: any = { analysis: {}, reader: {} };
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        if (buffer.trim().startsWith('<!DOCTYPE') || buffer.trim().startsWith('<html')) {
          console.error('Received HTML instead of JSON:', buffer);
          throw new Error('Server returned HTML error page instead of JSON stream. Check the server logs.');
        }

        let startIdx = 0;

        while (startIdx < buffer.length) {
          const openBraceIdx = buffer.indexOf('{', startIdx);
          if (openBraceIdx === -1) {
            buffer = "";
            break;
          }

          // Find matching closing brace
          let depth = 0;
          let closeBraceIdx = -1;
          for (let i = openBraceIdx; i < buffer.length; i++) {
            if (buffer[i] === '{') depth++;
            else if (buffer[i] === '}') {
              depth--;
              if (depth === 0) {
                closeBraceIdx = i;
                break;
              }
            }
          }

          if (closeBraceIdx === -1) {
            // Incomplete JSON — wait for more chunks
            buffer = buffer.substring(openBraceIdx);
            break;
          }

          try {
            const jsonStr = buffer.substring(openBraceIdx, closeBraceIdx + 1);
            const event = JSON.parse(jsonStr);
            setStreamingEvents(prev => [...prev, event]);

            if (event.type === 'workflow-result') {
              if (event.source === 'analysis') {
                accumulatedResult.analysis = event.payload;
              } else if (event.source === 'reader') {
                accumulatedResult.reader = event.payload;
              }
            }

            startIdx = closeBraceIdx + 1;
          } catch (e) {
            // Skip past this opening brace and try the next one
            console.error("Malformed JSON object, skipping");
            startIdx = openBraceIdx + 1;
          }
        }

        // Clear fully processed buffer
        if (startIdx > 0 && startIdx <= buffer.length) {
          buffer = buffer.substring(startIdx);
        }
      }

      setCombinedResult(accumulatedResult as CombinedAnalysisResult);

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

        {isLoading && !error && (
          <motion.div
            className="mx-auto max-w-2xl my-20 rounded-xl border border-neutral-200 bg-neutral-50 p-8 shadow-sm"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Loader2 className="h-6 w-6 text-green-500 animate-spin" aria-hidden="true" />
              <p className="text-xl font-semibold text-neutral-800">Analysis in progress...</p>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar text-left">
              {streamingEvents.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-neutral-100 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="mt-1 h-2 w-2 rounded-full bg-green-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-700">
                      {event.type.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                      {event.payload?.stepName && <span className="text-green-600 ml-2">[{event.payload.stepName}]</span>}
                    </p>
                    {event.payload?.status && (
                      <p className="text-xs text-neutral-500 mt-1 capitalize">Status: {event.payload.status}</p>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 capitalize">{event.source || 'system'}</span>
                </div>
              ))}
              {streamingEvents.length === 0 && (
                <p className="text-sm text-neutral-400 italic text-center py-4">Waiting for workflow to initialize...</p>
              )}
            </div>
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
