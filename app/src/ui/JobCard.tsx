import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, DollarSign, Target } from "lucide-react";

export function JobCard({id = "1", title, thresholds, salary, regions}:{id?: string; title:string; thresholds:string; salary:string; regions:string}) {
  return (
    <Link to={`/jobs/${id}`} className="block">
      <article className="job-card cursor-pointer">
        <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="h3 mb-3 text-lg" style={{textTransform: "none"}}>
              {title}
            </h3>
            
            {/* Requirements */}
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4" style={{color: "var(--warm-off-white)", opacity: "0.6"}} />
              <span className="body-small">{thresholds}</span>
            </div>
            
            {/* Salary and Regions */}
            <div className="flex flex-wrap items-center gap-4 body-small">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" style={{color: "var(--success)"}} />
                <span style={{color: "var(--success)"}}>{salary}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{color: "var(--info)"}} />
                <span style={{color: "var(--info)"}}>{regions}</span>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="status-indicator status-active">
            <div className="status-pulse" />
            <span>Active</span>
          </div>
        </div>
        
        {/* Divider */}
        <div style={{borderTop: "1px solid var(--border)"}} />
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="body-small flex items-center gap-2" style={{opacity: "0.6"}}>
            <span>Posted 2 days ago</span>
            <span>•</span>
            <span>5 applicants</span>
          </div>
          
          <div className="btn btn-ghost body-small inline-flex items-center">
            View Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>
        </div>
      </article>
    </Link>
  );
}
