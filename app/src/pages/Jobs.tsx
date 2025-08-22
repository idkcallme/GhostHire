import { useEffect, useState } from "react";
import { JobCard } from "../ui/JobCard";

interface Job {
  id: string;
  title: string;
  description: string;
  tags: string;
  // Individual threshold fields (from PostJob form)
  programmingThreshold: number;
  problemSolvingThreshold: number;
  rustThreshold: number;
  frontendThreshold: number;
  backendThreshold: number;
  blockchainThreshold: number;
  zkThreshold: number;
  devopsThreshold: number;
  typescriptThreshold: number;
  salaryMin: number;
  salaryMax: number;
  regions: string[];
  txHash?: string;
  deployedAt: string;
  status: string;
}

export function Jobs() {
  const [dynamicJobs, setDynamicJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Load jobs from localStorage
    const savedJobs = localStorage.getItem('ghosthire_jobs');
    if (savedJobs) {
      try {
        const jobs = JSON.parse(savedJobs) as Job[];
        setDynamicJobs(jobs);
        console.log('Loaded jobs from localStorage:', jobs);
      } catch (error) {
        console.error('Failed to parse saved jobs:', error);
      }
    }
  }, []);

  const formatThresholds = (job: Job) => {
    const skillMap = {
      'Programming': job.programmingThreshold,
      'Problem Solving': job.problemSolvingThreshold,
      'Rust': job.rustThreshold,
      'Frontend': job.frontendThreshold,
      'Backend': job.backendThreshold,
      'Blockchain': job.blockchainThreshold,
      'ZK': job.zkThreshold,
      'DevOps': job.devopsThreshold,
      'TypeScript': job.typescriptThreshold
    };

    const skills = Object.entries(skillMap)
      .filter(([_, threshold]) => threshold > 0)
      .map(([skill, threshold]) => `${skill} ≥${threshold}`)
      .slice(0, 3); // Show first 3 skills
    return skills.join(', ');
  };

  const formatSalary = (min: number, max: number) => {
    const formatK = (num: number) => num >= 1000 ? `${Math.round(num/1000)}k` : num.toString();
    return `${formatK(min)}–${formatK(max)}`;
  };

  const formatRegions = (regions: string[]) => {
    return regions.slice(0, 3).join(', '); // Show first 3 regions
  };

  return (
    <section className="section">
      <div className="grid-container">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="card sticky top-20 h-fit">
          <h3 className="h3 mb-3">Filters</h3>
          {/* role, region, salary, tags (stubs) */}
          <div className="space-y-4">
            <div className="form-field">
              <label className="body-small font-medium">Role</label>
              <input placeholder="e.g. Protocol Engineer, Frontend Developer"/>
            </div>
            <div className="form-field">
              <label className="body-small font-medium">Region</label>
              <input placeholder="e.g. US-CA, CA-ON, Remote"/>
            </div>
            <div className="form-field">
              <label className="body-small font-medium">Salary Range</label>
              <input placeholder="e.g. 70k-100k"/>
            </div>
            <div className="form-field">
              <label className="body-small font-medium">Skills</label>
              <input placeholder="e.g. Programming, Blockchain, ZK"/>
            </div>
          </div>
        </aside>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Dynamic jobs from localStorage (your posted jobs) */}
          {dynamicJobs.length > 0 && (
            <>
              {dynamicJobs.map((job) => (
                <div key={job.id} className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      🆕 Your Job
                    </span>
                  </div>
                  <JobCard 
                    id={job.id}
                    title={job.title}
                    thresholds={formatThresholds(job)}
                    salary={formatSalary(job.salaryMin, job.salaryMax)}
                    regions={formatRegions(job.regions)}
                  />
                </div>
              ))}
            </>
          )}
          
          {/* Static demo jobs */}
          <JobCard id="1" title="Senior Protocol Engineer" thresholds="Programming ≥80, Systems ≥70, Blockchain ≥60" salary="90–130k" regions="US-CA, US-NY" />
          <JobCard id="2" title="ZK Research Engineer" thresholds="Programming ≥75, ZK Proofs ≥85, Rust ≥70" salary="100–150k" regions="Remote, US-CA" />
          <JobCard id="3" title="Full-Stack Developer" thresholds="Programming ≥65, Frontend ≥75, Backend ≥70" salary="70–100k" regions="CA-ON, DE-BE" />
          <JobCard id="4" title="DevOps Engineer" thresholds="Programming ≥60, DevOps ≥80, Blockchain ≥40" salary="80–120k" regions="US-NY, UK-LON" />
          <JobCard id="5" title="Smart Contract Developer" thresholds="Programming ≥70, Blockchain ≥85, Problem Solving ≥75" salary="85–125k" regions="Remote, US-CA" />
          <JobCard id="6" title="Frontend Engineer" thresholds="Programming ≥65, Frontend ≥80, Problem Solving ≥70" salary="75–105k" regions="CA-ON, US-WA" />
        </div>
        </div>
      </div>
    </section>
  );
}