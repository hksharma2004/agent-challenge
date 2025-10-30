import React, { useState } from 'react';
import Link from 'next/link'; // Import Link
import { CheckCircle, FileText, Code, BookText, Shield, TestTube, AlertTriangle, XCircle, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer'; // Corrected import
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AnalysisResultsProps {
  analysisData: {
    codeQuality?: string;
    documentation?: string;
    testing?: string;
    security?: string;
    summary?: string;
    primaryLanguage?: string;
    files?: Array<{ path: string; content: string }>;
    success?: boolean; 
    error?: string; 
    [key: string]: any;
  };
}

export function AnalysisResults({ analysisData }: AnalysisResultsProps) {
  const [expandedFileIndex, setExpandedFileIndex] = useState<number | null>(null);

  const toggleFileContent = (index: number) => {
    setExpandedFileIndex(expandedFileIndex === index ? null : index);
  };


  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'codeQuality':
        return <Code className="h-5 w-5" />;
      case 'documentation':
        return <BookText className="h-5 w-5" />;
      case 'testing':
        return <TestTube className="h-5 w-5" />;
      case 'security':
        return <Shield className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.js') || fileName.endsWith('.jsx') || fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      return <Code className="h-4 w-4 text-blue-400 flex-shrink-0" />;
    }
    if (fileName.endsWith('.json')) {
      return <FileText className="h-4 w-4 text-purple-400 flex-shrink-0" />;
    }
    if (fileName.endsWith('.md')) {
      return <BookText className="h-4 w-4 text-gray-400 flex-shrink-0" />;
    }
    return <FileText className="h-4 w-4 text-green-400 flex-shrink-0" />;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);

  };

  if (!analysisData) {
    return null;
  }

  const { codeQuality, documentation, testing, security, summary, primaryLanguage, files, success, error } = analysisData;

  const analysisCategories = [
    { name: 'Code Quality', key: 'codeQuality', score: codeQuality },
    { name: 'Documentation', key: 'documentation', score: documentation },
    { name: 'Testing', key: 'testing', score: testing },
    { name: 'Security', key: 'security', score: security },
  ];

  return (
    <div className="space-y-8 border-[3px] border-black bg-white rounded-lg p-10 shadow-[4px_4px_0_0_#000] text-white">

      <div className="text-center mb-8">
        {success === true && (
          <h1 className="text-5xl font-extrabold text-green-400 flex items-center justify-center gap-4 mb-3">
            <CheckCircle className="h-10 w-10" />
            Analysis Result
          </h1>
        )}
        {success === false && (
          <h1 className="text-5xl font-extrabold text-red-400 flex items-center justify-center gap-4 mb-3">
            <XCircle className="h-10 w-10" />
            Analysis Failed
          </h1>
        )}
        {success === undefined && ( 
          <h1 className="text-5xl font-extrabold text-yellow-400 flex items-center justify-center gap-4 mb-3">
            <AlertTriangle className="h-10 w-10" />
            Analysis Warning
          </h1>
        )}
        <p className="text-xl text-gray-400 font-semibold">Overall Repository Analysis</p>
      </div>

      {error && (
        <Card className="border-[3px] border-black bg-red-900/50 rounded-lg p-10 shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-transform">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-300 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-400 leading-relaxed">{error}</p>
          </CardContent>
        </Card>
      )}


      {summary && (
        <Card className="border-[3px] border-black bg-white rounded-lg p-10 shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-transform">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
              <BookText className="h-7 w-7 text-green-400" /> Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-gray-300 leading-relaxed mb-2">{summary}</p>
            {primaryLanguage && (
              <p className="text-sm text-gray-400 mt-4">
                Primary Language: <span className="font-medium text-green-400">{primaryLanguage}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}


      {(codeQuality || documentation || testing || security) && (
        <Card className="border-[3px] border-black bg-white rounded-lg p-10 shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-transform">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
              <Code className="h-7 w-7 text-green-400" /> Analysis Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {analysisCategories.map((category) => (
                <Card key={category.key} className="border-[3px] border-black bg-white rounded-lg p-10 shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-transform flex flex-col">
                  <CardHeader className="flex-row items-center gap-2 p-0 pb-2">
                    {getCategoryIcon(category.key)}
                    <CardTitle className="text-lg font-medium text-gray-300">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow p-0 pt-2 text-gray-200 text-sm leading-relaxed">
                    {category.score ? <MarkdownRenderer content={category.score} /> : <p className="text-gray-500">N/A</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}


      {files && files.length > 0 && (
        <Card className="border-[3px] border-black bg-white rounded-lg p-10 shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-transform">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
              <FileText className="h-7 w-7 text-green-400" /> Files Analyzed
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3 text-gray-300">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-700/40 p-3 rounded-md hover:bg-gray-600/40 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.path)}
                    <button
                      onClick={() => toggleFileContent(index)}
                      className="font-mono text-lg text-green-300 hover:text-green-200 transition-colors flex items-center gap-2"
                    >
                      {file.path}
                      {expandedFileIndex === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(file.path)}
                          className="text-gray-400 hover:text-green-400"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy file path</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li>
              ))}
            </ul>
            {expandedFileIndex !== null && files[expandedFileIndex] && (
              <div className="mt-4 p-4 bg-gray-700/50 rounded-md border border-gray-600">
                <h4 className="text-lg font-semibold text-white mb-2">Content of {files[expandedFileIndex].path}</h4>
                <div className="max-h-96 overflow-y-auto text-sm text-gray-300 bg-gray-800 p-3 rounded-md">
                  <MarkdownRenderer content={files[expandedFileIndex].content} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {files && files.length === 0 && (
        <Card className="border-[3px] border-black bg-white rounded-lg p-10 shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-transform">
          <CardContent className="py-6">
            <p className="text-gray-400 italic text-center text-lg">No files found in the analysis result.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
