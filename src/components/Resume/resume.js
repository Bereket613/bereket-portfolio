import React, { useState, useEffect } from 'react';
import api, { absoluteUrl } from '../../api';
import { experienceData as fallbackExperience, projectsData as fallbackProjects } from '../../data/portfolioData';

const ResumePage = () => {
    const [profile, setProfile] = useState({});
    const [experiences, setExperiences] = useState(fallbackExperience);
    const [projects, setProjects] = useState(fallbackProjects.slice(0, 5));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [profRes, expRes, projRes] = await Promise.all([
                    api.get('/api/profile'),
                    api.get('/api/experiences'),
                    api.get('/api/projects')
                ]);
                if (profRes.data && Object.keys(profRes.data).length > 0) setProfile(profRes.data);
                if (expRes.data && expRes.data.length > 0) setExperiences(expRes.data);
                if (projRes.data && projRes.data.length > 0) setProjects(projRes.data.slice(0, 5));
            } catch (err) {
                console.error("Resume load error:", err);
            }
            setLoading(false);
        };
        fetchAll();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const resumePdfUrl = profile.resume_url ? absoluteUrl(profile.resume_url) : (process.env.PUBLIC_URL + '/resume.pdf');

    if (loading) return <div className="min-h-screen pt-32 pb-20 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div></div>;

    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900 print:bg-white print:pt-0 print:pb-0 font-sans transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 print:px-0 print:max-w-none">
                
                {/* Controls - Hidden during print */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8 print:hidden">
                    <h1 className="text-3xl font-bold dark:text-white">Curriculum Vitae</h1>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={handlePrint} className="bg-white dark:bg-slate-800 border-2 border-accent text-accent px-6 py-2 rounded-full font-medium hover:bg-accent hover:text-white transition-all duration-300 flex items-center gap-2">
                            <i className="fas fa-eye"></i> View CV
                        </button>
                        <a href={resumePdfUrl} download="Bereket-Getaw-CV.pdf" className="bg-accent text-white px-6 py-2 rounded-full font-medium shadow-[0_10px_20px_rgba(15,118,110,0.25)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                            <i className="fas fa-download"></i> Download CV
                        </a>
                    </div>
                </div>

                {/* CV Document Body */}
                <div className="bg-white p-10 md:p-14 shadow-2xl rounded-3xl print:shadow-none print:p-0 print:rounded-none bg-white text-slate-900 border border-slate-100 print:border-none relative overflow-hidden">
                    
                    {/* Header Layout */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10 pb-8 border-b-2 border-slate-100 print:mb-6 print:pb-6">
                        {profile.logo_url && (
                            <img src={absoluteUrl(profile.logo_url)} alt="Logo" className="w-24 h-24 object-contain rounded-xl print:w-20 print:h-20" />
                        )}
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{profile.name || 'Bereket Getaw'}</h1>
                            <p className="text-xl text-accent font-semibold mt-1">{profile.title || 'AI / Machine Learning Engineer'}</p>
                            
                            <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2 mt-4 text-sm font-medium text-slate-600">
                                {profile.email && <span className="flex items-center gap-1.5"><i className="fas fa-envelope text-accent"></i> {profile.email}</span>}
                                {profile.linkedin && <span className="flex items-center gap-1.5"><i className="fab fa-linkedin text-accent"></i> {profile.linkedin.replace('https://','').replace('www.','')}</span>}
                                {profile.github && <span className="flex items-center gap-1.5"><i className="fab fa-github text-accent"></i> {profile.github.replace('https://','').replace('www.','')}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 print:gap-8">
                        {/* Main Pillar */}
                        <div className="lg:col-span-2 space-y-10 print:space-y-6">
                            
                            {profile.about && (
                                <section>
                                    <h2 className="text-xl font-bold text-slate-900 mb-3 pb-1 border-b border-slate-200">Professional Summary</h2>
                                    <p className="text-slate-700 leading-relaxed text-sm">{profile.about}</p>
                                </section>
                            )}

                            {experiences.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-bold text-slate-900 mb-5 pb-1 border-b border-slate-200">Experience</h2>
                                    <div className="space-y-8 print:space-y-6">
                                        {experiences.map(exp => (
                                            <div key={exp.id}>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-1">
                                                    <h3 className="text-lg text-slate-900 font-bold">{exp.role}</h3>
                                                    <span className="text-sm font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full mt-1 sm:mt-0 print:border print:border-accent print:bg-transparent">{exp.duration}</span>
                                                </div>
                                                <h4 className="text-md text-slate-600 font-medium mb-2">{exp.organization}</h4>
                                                
                                                <p className="text-slate-700 text-sm leading-relaxed mb-2">{exp.description}</p>
                                                
                                                {exp.key_achievements && exp.key_achievements.length > 0 && (
                                                    <ul className="list-disc list-outside text-slate-700 text-sm space-y-1 ml-4 mt-2">
                                                        {exp.key_achievements.map((achieve, i) => (
                                                            <li key={i}>{achieve}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                                {exp.tech_stack && exp.tech_stack.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                                        {exp.tech_stack.map((t, idx) => <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium print:border print:border-slate-300">{t}</span>)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar Pillar */}
                        <div className="space-y-10 print:space-y-6">
                            
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-4 pb-1 border-b border-slate-200">Featured Projects</h2>
                                <div className="space-y-5 print:space-y-4">
                                    {projects.map(proj => (
                                        <div key={proj.id} className="print:break-inside-avoid">
                                            <h3 className="font-bold text-slate-900 text-sm">{proj.title}</h3>
                                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-4 pb-1 border-b border-slate-200">Education</h2>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">BSc — Data Science</h3>
                                    <p className="text-sm text-slate-600 mt-0.5">Debre Berhan University</p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-4 pb-1 border-b border-slate-200">Technical Skills</h2>
                                <div className="space-y-2.5 text-xs">
                                    <div><span className="font-semibold text-slate-900">Machine Learning:</span> <span className="text-slate-600">Supervised/Unsupervised Learning, Classification, Regression, Anomaly Detection, Model Evaluation</span></div>
                                    <div><span className="font-semibold text-slate-900">Deep Learning:</span> <span className="text-slate-600">Neural Networks, PyTorch, TensorFlow, Representation Learning</span></div>
                                    <div><span className="font-semibold text-slate-900">NLP:</span> <span className="text-slate-600">Transformers, LLMs, RAG, Multilingual &amp; Amharic NLP</span></div>
                                    <div><span className="font-semibold text-slate-900">Computer Vision:</span> <span className="text-slate-600">Image Classification, Object Detection, Pose Estimation, Image Processing</span></div>
                                    <div><span className="font-semibold text-slate-900">Big Data &amp; Tools:</span> <span className="text-slate-600">Apache Spark, PySpark, Python, R, SQL, Git, GitHub</span></div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-4 pb-1 border-b border-slate-200">Contact</h2>
                                <div className="text-xs text-slate-600 space-y-1.5">
                                    <p><span className="font-semibold text-slate-900">GitHub:</span> github.com/Bereket613</p>
                                    <p><span className="font-semibold text-slate-900">Location:</span> Addis Ababa, Ethiopia</p>
                                </div>
                            </section>
                            
                        </div>
                    </div>
                </div>
                
                {/* Print specific CSS fix */}
                <style dangerouslySetInnerHTML={{__html: `
                    @media print {
                        body { background: white !important; font-size: 12pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        nav, footer, .print\\:hidden { display: none !important; }
                        @page { margin: 1cm; size: a4 portrait; }
                    }
                `}} />
            </div>
        </div>
    );
};

export default ResumePage;
