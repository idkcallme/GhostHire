import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, DollarSign, Target, Clock, Users, Building } from "lucide-react";
import { ProofStepper } from "../zk/ProofStepper";

export function JobDetail() {
  const { id } = useParams();
  
  // Mock job data - in real app, fetch based on ID
  const [job] = useState({
    id: id || "1",
    title: "Senior Protocol Engineer",
    company: "ZK Labs",
    description: "We're looking for a passionate Senior Protocol Engineer to join our team building the next generation of privacy-preserving protocols. You'll work on cutting-edge zero-knowledge technology and help shape the future of decentralized systems.",
    requirements: [
      "5+ years of systems programming experience",
      "Strong knowledge of Rust or C++",
      "Experience with blockchain and cryptography",
      "Understanding of zero-knowledge proofs preferred",
      "Strong problem-solving and debugging skills"
    ],
    responsibilities: [
      "Design and implement core protocol features",
      "Optimize performance-critical systems",
      "Collaborate with research team on ZK implementations",
      "Mentor junior developers and review code",
      "Contribute to protocol specifications and documentation"
    ],
    thresholds: { 
      programming: 80, 
      problemSolving: 75,
      rust: 70, 
      blockchain: 60,
      zk: 50 
    },
    salary: { min: 90_000, max: 130_000 },
    regions: ["US-CA", "US-NY", "Remote"],
    regionRoot: "0x8f3a2b1c...",
    postedDate: "2 days ago",
    applicants: 12,
    deadline: "2 weeks remaining"
  });

  return (
    <section className="section-large">
      <div className="grid-container">
        <div className="content-wide">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/jobs" className="inline-flex items-center gap-2 body-large opacity-70 hover:opacity-100 transition-opacity">
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Link>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Job Info */}
            <div className="space-y-6">
              {/* Header */}
              <div className="card">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{background: "var(--primary-muted)"}}>
                    <Building className="w-6 h-6" style={{color: "var(--primary)"}} />
                  </div>
                  <div className="flex-1">
                    <h1 className="h1 mb-2" style={{fontSize: "clamp(2rem, 4vw, 3rem)"}}>{job.title}</h1>
                    <p className="body-large" style={{color: "var(--primary)"}}>{job.company}</p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" style={{color: "var(--success)"}} />
                    <span className="body-small">${job.salary.min/1000}k–${job.salary.max/1000}k</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{color: "var(--info)"}} />
                    <span className="body-small">{job.regions.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{opacity: "0.6"}} />
                    <span className="body-small">Posted {job.postedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" style={{opacity: "0.6"}} />
                    <span className="body-small">{job.applicants} applicants</span>
                  </div>
                </div>

                {/* Skills Requirements */}
                <div className="p-4 rounded-lg" style={{background: "var(--primary-muted)", border: "1px solid rgba(91, 140, 255, 0.2)"}}>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4" style={{color: "var(--primary)"}} />
                    <span className="body-large font-medium" style={{color: "var(--primary)"}}>Skill Requirements</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 body-small">
                    <div>Programming: {job.thresholds.programming}/100</div>
                    <div>Problem Solving: {job.thresholds.problemSolving}/100</div>
                    <div>Rust/Systems: {job.thresholds.rust}/100</div>
                    <div>Blockchain: {job.thresholds.blockchain}/100</div>
                    <div>Zero-Knowledge: {job.thresholds.zk}/100</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="card">
                <h3 className="h3 mb-4" style={{textTransform: "none"}}>About this Role</h3>
                <p className="body-large mb-6" style={{opacity: "0.8"}}>{job.description}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="body-large font-semibold mb-3">Requirements</h4>
                    <ul className="space-y-2">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 body-small">
                          <div className="w-1.5 h-1.5 rounded-full mt-2" style={{background: "var(--primary)"}} />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="body-large font-semibold mb-3">Responsibilities</h4>
                    <ul className="space-y-2">
                      {job.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2 body-small">
                          <div className="w-1.5 h-1.5 rounded-full mt-2" style={{background: "var(--success)"}} />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Panel */}
            <div className="lg:sticky lg:top-20 h-fit">
              <ProofStepper job={job} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
