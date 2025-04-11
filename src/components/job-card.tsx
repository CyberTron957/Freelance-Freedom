"use client";

import Link from "next/link";
import { formatDate, shortenAddress } from "@/lib/utils";
import { Button } from "./ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "./ui/card";

// Status enum mapping
const JobStatus = ["Created", "Funded", "Completed", "Disputed", "Refunded", "Cancelled"];

type JobProps = {
  id: string;
  client: string;
  freelancer: string;
  amount: string;
  title: string;
  description: string;
  status: number;
  createdAt: number;
  completedAt: number;
};

export function JobCard({ job }: { job: JobProps }) {
  // Status badge color
  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case 1: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 2: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 3: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case 4: return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case 5: return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const truncateDescription = (desc: string) => {
    return desc.length > 150 ? `${desc.substring(0, 150)}...` : desc;
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{job.title}</CardTitle>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
            {JobStatus[job.status]}
          </span>
        </div>
        <CardDescription className="flex items-center gap-2 text-xs">
          <span>Posted by: {shortenAddress(job.client)}</span>
          <span>•</span>
          <span>{formatDate(job.createdAt)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{truncateDescription(job.description)}</p>
        <div className="mt-4 flex items-center text-sm font-medium">
          <svg className="mr-1.5 h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-primary">{job.amount} ETH</span>
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <Link href={`/jobs/${job.id}`} className="w-full">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 