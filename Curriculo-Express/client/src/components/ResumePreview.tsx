import { forwardRef } from "react";
import { type ResumeData } from "@shared/schema";
import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumePreviewProps {
  data: ResumeData;
  scale?: number;
}

// === TEMPLATE: MODERN ===
const ModernTemplate = ({ data }: { data: ResumeData }) => {
  const { personalInfo, experience, education, skills, color } = data;

  return (
    <div className="flex h-full min-h-[297mm] text-slate-800">
      {/* Sidebar */}
      <div className="w-[32%] bg-slate-50 p-8 border-r border-slate-100 flex flex-col gap-8">
        {personalInfo.photo && (
          <div className="relative w-24 h-24 mx-auto rounded-lg overflow-hidden border-2 border-slate-200 bg-white">
            <img 
              src={personalInfo.photo} 
              alt={personalInfo.fullName} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-4">
            Contato
          </h2>
          
          <div className="space-y-3 text-sm">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate" title={personalInfo.email}>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-4">
              Habilidades
            </h2>
            <div className="flex flex-col gap-2">
              {skills.map((skill, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-medium text-slate-700">{skill.name}</span>
                    <span className="text-xs text-slate-400">{skill.level}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-slate-800"
                      style={{ 
                        width: skill.level === 'Fluente' ? '100%' : 
                               skill.level === 'Avançado' ? '85%' : 
                               skill.level === 'Intermediário' ? '60%' : '30%',
                        backgroundColor: color 
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-4">
              Educação
            </h2>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i}>
                  <div className="font-bold text-slate-800">{edu.institution}</div>
                  <div className="text-sm text-slate-600 font-medium mb-1">{edu.degree}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    {edu.startDate} - {edu.endDate || "Presente"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 pt-10">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 uppercase tracking-tight" style={{ color }}>
            {personalInfo.fullName}
          </h1>
          <p className="text-lg text-slate-500 font-medium">{data.objective ? "Objetivo Profissional" : "Profissional"}</p>
        </header>

        {data.objective && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-4">
              Perfil
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              {data.objective}
            </p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-4">
              Experiência Profissional
            </h2>
            <div className="space-y-6">
              {experience.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-slate-100">
                  <div 
                    className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-800 text-lg">{exp.position}</h3>
                    <span className="text-xs font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-500 whitespace-nowrap">
                      {exp.startDate} – {exp.current ? "Atualmente" : exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    {exp.company}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// === TEMPLATE: CLASSIC ===
const ClassicTemplate = ({ data }: { data: ResumeData }) => {
  const { personalInfo, experience, education, skills, color } = data;

  return (
    <div className="p-12 h-full min-h-[297mm] font-serif text-slate-900 bg-white">
      {/* Header */}
      <header className="text-center border-b-2 border-slate-800 pb-6 mb-8" style={{ borderColor: color }}>
        {personalInfo.photo && (
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-slate-800 mb-4 bg-white" style={{ borderColor: color }}>
            <img 
              src={personalInfo.photo} 
              alt={personalInfo.fullName} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-3" style={{ color }}>
          {personalInfo.fullName}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-600 font-sans">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• linkedin.com</span>}
        </div>
      </header>

      {/* Content */}
      <div className="space-y-6">
        {data.objective && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-3 pb-1" style={{ color }}>
              Resumo Profissional
            </h2>
            <p className="text-sm leading-relaxed text-slate-700 text-justify">
              {data.objective}
            </p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-4 pb-1" style={{ color }}>
              Experiência Profissional
            </h2>
            <div className="space-y-5">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1 font-sans">
                    <h3 className="font-bold text-base">{exp.company}</h3>
                    <span className="text-sm text-slate-600 italic">
                      {exp.startDate} - {exp.current ? "Presente" : exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-medium mb-2 italic text-slate-800">{exp.position}</div>
                  <p className="text-sm text-slate-700 leading-relaxed text-justify whitespace-pre-line font-sans">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-4 pb-1" style={{ color }}>
              Formação Acadêmica
            </h2>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start font-sans">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{edu.institution}</h3>
                    <div className="text-sm text-slate-700">{edu.degree}</div>
                  </div>
                  <div className="text-sm text-slate-600 italic text-right whitespace-nowrap">
                    {edu.startDate} - {edu.endDate || "Conclusão"}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-3 pb-1" style={{ color }}>
              Habilidades e Competências
            </h2>
            <div className="flex flex-wrap gap-2 font-sans text-sm">
              {skills.map((skill, i) => (
                <span key={i} className="bg-slate-100 px-3 py-1 rounded-sm border border-slate-200">
                  {skill.name} {skill.level && <span className="text-slate-400 ml-1 text-xs">• {skill.level}</span>}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// === TEMPLATE: MINIMAL ===
const MinimalTemplate = ({ data }: { data: ResumeData }) => {
  const { personalInfo, experience, education, skills, color } = data;

  return (
    <div className="p-12 h-full min-h-[297mm] font-sans text-slate-900 bg-white">
      <header className="mb-12 flex gap-8 items-start">
        {personalInfo.photo && (
          <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-slate-300 flex-shrink-0 bg-slate-100">
            <img 
              src={personalInfo.photo} 
              alt={personalInfo.fullName} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-5xl font-light tracking-tight text-slate-900 mb-6">
            {personalInfo.fullName}
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-medium">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {personalInfo.location}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-[1fr_2.5fr] gap-12">
        {/* Left Column (Meta) */}
        <div className="space-y-10">
          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Educação</h2>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="font-semibold text-slate-800">{edu.institution}</div>
                    <div className="text-sm text-slate-500 mb-1">{edu.degree}</div>
                    <div className="text-xs text-slate-400">{edu.startDate} - {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span 
                    key={i} 
                    className="text-sm px-2 py-1 bg-slate-50 rounded text-slate-700 font-medium"
                    style={{ borderLeft: `3px solid ${color}` }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Social</h2>
            <div className="space-y-2 text-sm text-slate-600">
              {personalInfo.linkedin && <div className="truncate opacity-80 hover:opacity-100 transition-opacity">{personalInfo.linkedin}</div>}
              {personalInfo.website && <div className="truncate opacity-80 hover:opacity-100 transition-opacity">{personalInfo.website}</div>}
            </div>
          </section>
        </div>

        {/* Right Column (Main) */}
        <div className="space-y-10">
          {data.objective && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Sobre</h2>
              <p className="text-slate-600 leading-relaxed">
                {data.objective}
              </p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Experiência</h2>
              <div className="space-y-8">
                {experience.map((exp, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors duration-300" style={{ color: "inherit" }}>
                        {exp.position}
                      </h3>
                      <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">
                        {exp.startDate} — {exp.current ? "Atualmente" : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3" style={{ color }}>
                      {exp.company}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data, scale = 1 }, ref) => {
  return (
    <div 
      ref={ref}
      id="resume-preview"
      className="resume-paper origin-top transition-transform duration-200"
      style={{ transform: `scale(${scale})` }}
    >
      {data.templateId === 'modern' && <ModernTemplate data={data} />}
      {data.templateId === 'classic' && <ClassicTemplate data={data} />}
      {data.templateId === 'minimal' && <MinimalTemplate data={data} />}
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";
