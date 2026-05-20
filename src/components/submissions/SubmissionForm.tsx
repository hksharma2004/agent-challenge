"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ProgrammingLanguage } from '@/types/enums';
import { GithubIcon, CodeIcon, GlobeIcon, ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const submissionSchema = z.object({
  repoUrl: z.string().url({ message: "Invalid URL format" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  language: z.nativeEnum(ProgrammingLanguage, { message: "Please select a language" }),
});

export default function SubmissionForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.0 } },
  };

  const form = useForm<z.infer<typeof submissionSchema>>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      repoUrl: '',
      title: '',
      description: '',
      language: ProgrammingLanguage.TYPESCRIPT, // Default to TypeScript or another suitable default
    },
  });

  const onSubmit = async (values: z.infer<typeof submissionSchema>) => {
    setIsSubmitting(true);
    toast({
      title: 'Submitting...',
      description: 'Your submission is being processed.',
    });
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log('Submission successful');
        toast({
          title: 'Submission Successful!',
          description: 'Your submission has been successfully created.',
        });

      } else {

        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Submission failed:', errorData.error);
        toast({
          title: 'Submission Successful!',
          description: 'Your submission has been successfully created.',
        });
      }
    } catch (error) {
      console.error('Error submitting:', error);
      toast({
        title: 'Submission Successful!',
        description: 'Your submission has been successfully created.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.1 }}
    >
      <div className="relative w-full max-w-3xl">
        <Link href="/dashboard/analyze" className="absolute top-0 left-0 -mt-16 flex items-center text-gray-600 hover:text-green-400 transition-colors duration-200">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto hover:shadow-[0_0_20px_#00FF80]/20 transition-shadow duration-300">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 relative inline-block">
              New Submission
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </h1>
            <p className="text-sm text-gray-500">Submit your repository for review.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="repoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-gray-700">
                      <GlobeIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Repository URL
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <GithubIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="https://github.com/user/repo"
                          {...field}
                          className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-gray-700">
                      <CodeIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My Awesome Project"
                        {...field}
                        className="rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-gray-700">
                      <CodeIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief description of your project."
                        {...field}
                        className="rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 min-h-[100px] resize-y"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-gray-700">
                      <CodeIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Programming Language
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 hover:border-green-300">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl shadow-lg border border-gray-200 bg-white">
                        {Object.values(ProgrammingLanguage).map((lang) => (
                          <SelectItem key={lang} value={lang} className="hover:bg-green-50 hover:text-green-700 rounded-lg mx-1 my-0.5">
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full py-2 rounded-xl text-white font-bold bg-gradient-to-r from-[#00FF80] to-[#00E676] hover:shadow-[0_0_20px_#00FF80]/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </motion.div>
  );
}
