/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

// Score Card Component
const ScoreCard = ({ title, score, color }: { title: string; score: number; color: string }) => {
    const colorClasses: Record<string, string> = {
        purple: 'from-purple-500 to-pink-500',
        blue: 'from-blue-500 to-cyan-500',
        green: 'from-green-500 to-emerald-500',
        pink: 'from-pink-500 to-rose-500'
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-colors">
            <h4 className="text-white/70 text-sm mb-3 font-semibold">{title}</h4>
            <div className="flex items-end justify-between mb-3">
                <div className="text-4xl font-bold text-white">{Math.round(score)}</div>
                <div className="text-white/60 text-sm">/ 100</div>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${colorClasses[color] || colorClasses.purple} transition-all duration-1000`}
                    style={{ width: `${Math.min(score, 100)}%` }}
                ></div>
            </div>
        </div>
    );
};

// Report Screen Component
const ReportScreenComponent = ({ interviewData, onRestart }: { interviewData: any; onRestart: () => void }) => {
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Download report as colored PDF
    const downloadReportAsPDF = async () => {
        if (!report) return;

        try {
            const html2pdf = (await import('html2pdf.js')).default;

            const htmlContent = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 50px; color: #1a1a1a; background: white; line-height: 1.8;">
                    <!-- Header Section -->
                    <div style="text-align: center; margin-bottom: 50px; border-bottom: 4px solid #7c3aed; padding-bottom: 30px;">
                        <h1 style="color: #7c3aed; margin: 0; font-size: 42px; font-weight: 700;">Interview Report</h1>
                        <p style="color: #666; margin: 15px 0 0 0; font-size: 18px; font-weight: 300;">Your Performance Analysis</p>
                    </div>

                    <!-- Score Cards Section -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 50px; page-break-inside: avoid;">
                        <!-- Overall Score -->
                        <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);">
                            <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 600;">Overall Score</p>
                            <h2 style="margin: 15px 0 5px 0; font-size: 48px; font-weight: 700;">${report.overallScore || 0}</h2>
                            <p style="margin: 0; font-size: 14px; opacity: 0.9;">out of 100</p>
                        </div>
                        <!-- Technical & Communication Scores -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);">
                                <p style="margin: 0; font-size: 14px; opacity: 0.95; font-weight: 600;">Technical</p>
                                <h3 style="margin: 10px 0 0 0; font-size: 36px; font-weight: 700;">${report.technicalScore || 0}</h3>
                            </div>
                            <div style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);">
                                <p style="margin: 0; font-size: 14px; opacity: 0.95; font-weight: 600;">Communication</p>
                                <h3 style="margin: 10px 0 0 0; font-size: 36px; font-weight: 700;">${report.communicationScore || 0}</h3>
                            </div>
                        </div>
                    </div>

                    <!-- Confidence Score -->
                    <div style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 50px; text-align: center; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);">
                        <p style="margin: 0; font-size: 16px; font-weight: 600;">Confidence Score</p>
                        <h3 style="margin: 10px 0 0 0; font-size: 36px; font-weight: 700;">${report.confidenceScore || 0} / 100</h3>
                    </div>

                    <!-- Detailed Feedback -->
                    <div style="margin-bottom: 50px; padding: 30px; background: #f9fafb; border-left: 5px solid #7c3aed; border-radius: 8px; page-break-inside: avoid;">
                        <h2 style="color: #7c3aed; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; border-bottom: 2px solid #7c3aed; padding-bottom: 15px;">📋 Detailed Feedback</h2>
                        <p style="color: #333; line-height: 1.8; font-size: 15px; margin: 0;">${report.feedback || 'No detailed feedback available'}</p>
                    </div>

                    <!-- Strengths Section -->
                    <div style="margin-bottom: 50px; padding: 30px; background: #f0fdf4; border-left: 5px solid #10b981; border-radius: 8px; page-break-inside: avoid;">
                        <h2 style="color: #10b981; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; border-bottom: 2px solid #10b981; padding-bottom: 15px;">✓ Your Strengths</h2>
                        <div style="margin: 0;">
                            ${Array.isArray(report.strengths) && report.strengths.length > 0
                    ? report.strengths.map((s: string) => `<p style="margin: 12px 0; color: #10b981; padding-left: 25px; position: relative; font-size: 15px;"><span style="position: absolute; left: 0; color: #059669; font-weight: bold;">✓</span>${s}</p>`).join('')
                    : '<p style="color: #999;">No strengths data available</p>'
                }
                        </div>
                    </div>

                    <!-- Areas for Improvement -->
                    <div style="margin-bottom: 50px; padding: 30px; background: #fffbeb; border-left: 5px solid #f59e0b; border-radius: 8px; page-break-inside: avoid;">
                        <h2 style="color: #f59e0b; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; border-bottom: 2px solid #f59e0b; padding-bottom: 15px;">↗ Areas for Improvement</h2>
                        <div style="margin: 0;">
                            ${Array.isArray(report.improvements) && report.improvements.length > 0
                    ? report.improvements.map((i: string) => `<p style="margin: 12px 0; color: #d97706; padding-left: 25px; position: relative; font-size: 15px;"><span style="position: absolute; left: 0; color: #f59e0b; font-weight: bold;">→</span>${i}</p>`).join('')
                    : '<p style="color: #999;">No improvement suggestions available</p>'
                }
                        </div>
                    </div>

                    ${Array.isArray(report.perQuestionFeedback) && report.perQuestionFeedback.length > 0 ? `
                        <!-- Per-Question Feedback -->
                        <div style="margin-bottom: 50px; page-break-inside: avoid;">
                            <h2 style="color: #7c3aed; margin: 0 0 25px 0; font-size: 24px; font-weight: 700; border-bottom: 3px solid #7c3aed; padding-bottom: 15px;">❓ Per-Question Feedback</h2>
                            ${report.perQuestionFeedback.map((q: any, idx: number) => `
                                <div style="background: white; padding: 25px; margin-bottom: 25px; border-left: 5px solid #7c3aed; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); page-break-inside: avoid;">
                                    <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">Question ${idx + 1}</h3>
                                    <p style="color: #666; margin: 0 0 15px 0; font-size: 15px; line-height: 1.6; padding: 0;">${q.question || 'N/A'}</p>
                                    
                                    ${q.candidateAnswer ? `
                                        <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3b82f6;">
                                            <p style="margin: 0; font-size: 13px; color: #1e40af; font-weight: 600;">Your Answer</p>
                                            <p style="margin: 10px 0 0 0; color: #1e40af; font-size: 14px; line-height: 1.6; word-wrap: break-word; white-space: pre-wrap;">${q.candidateAnswer}</p>
                                        </div>
                                    ` : ''}
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
                                        <p style="margin: 0; color: #7c3aed; font-weight: 700; font-size: 15px;">Score: <span style="font-size: 20px;">${q.score || 0}</span>/100</p>
                                    </div>
                                    
                                    <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #6366f1;">
                                        <p style="margin: 0; color: #333; font-weight: 600; font-size: 14px; margin-bottom: 8px;">💡 Feedback</p>
                                        <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">${q.feedback || 'No feedback available'}</p>
                                    </div>
                                    
                                    ${q.visualAnalysis ? `
                                        <div style="background: #ecfdf5; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #059669;">
                                            <p style="margin: 0; color: #059669; font-weight: 600; font-size: 14px; margin-bottom: 8px;">📸 Visual Analysis</p>
                                            <p style="margin: 0; color: #059669; font-size: 14px; line-height: 1.6;">${q.visualAnalysis}</p>
                                        </div>
                                    ` : ''}
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; font-size: 13px;">
                                        ${q.emotion ? `<p style="margin: 0; color: #666;"><strong>😊 Emotion:</strong> ${q.emotion}</p>` : ''}
                                        ${q.tone ? `<p style="margin: 0; color: #666;"><strong>🎤 Tone:</strong> ${q.tone}</p>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${report.toneAnalysis ? `
                        <!-- Tone Analysis -->
                        <div style="margin-bottom: 50px; padding: 30px; background: #fef3c7; border-left: 5px solid #f59e0b; border-radius: 8px; page-break-inside: avoid;">
                            <h2 style="color: #f59e0b; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; border-bottom: 2px solid #f59e0b; padding-bottom: 15px;">🎙️ Tone Analysis</h2>
                            <p style="color: #333; line-height: 1.8; font-size: 15px; margin: 0;">${report.toneAnalysis}</p>
                        </div>
                    ` : ''}

                    ${Array.isArray(report.recommendations) && report.recommendations.length > 0 ? `
                        <!-- Recommendations -->
                        <div style="margin-bottom: 50px; padding: 30px; background: #f3f4f6; border-left: 5px solid #7c3aed; border-radius: 8px; page-break-inside: avoid;">
                            <h2 style="color: #7c3aed; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; border-bottom: 2px solid #7c3aed; padding-bottom: 15px;">🎯 Recommendations</h2>
                            <ol style="margin: 0; padding-left: 25px;">
                                ${report.recommendations.map((r: string) => `<li style="margin: 12px 0; color: #333; font-size: 15px; line-height: 1.6;">${r}</li>`).join('')}
                            </ol>
                        </div>
                    ` : ''}

                    <!-- Footer -->
                    <div style="border-top: 3px solid #e5e7eb; padding-top: 30px; margin-top: 40px; text-align: center; color: #999; font-size: 13px;">
                        <p style="margin: 0;">Generated on ${new Date().toLocaleString()}</p>
                        <p style="margin: 10px 0 0 0;">Minterviewer - AI Interview Analysis Platform</p>
                    </div>
                </div>
            `;

            const element = document.createElement('div');
            element.innerHTML = htmlContent;

            const options = {
                margin: [15, 15, 15, 15] as [number, number, number, number],
                filename: `interview-report-${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    windowWidth: 800,
                    windowHeight: 1200
                },
                jsPDF: {
                    orientation: 'portrait' as const,
                    unit: 'mm' as const,
                    format: 'a4' as const,
                    compress: true
                }
            };

            html2pdf().set(options).from(element).save();
        } catch (error) {
            console.error('Error downloading report as PDF:', error);
            downloadReportAsText();
        }
    };

    const downloadReportAsText = () => {
        if (!report) return;

        let reportText = 'INTERVIEW REPORT\n';
        reportText += '=====================================\n\n';
        reportText += `Overall Score: ${report.overallScore || 0}/100\n`;
        reportText += `Technical Score: ${report.technicalScore || 0}/100\n`;
        reportText += `Communication Score: ${report.communicationScore || 0}/100\n`;
        reportText += `Confidence Score: ${report.confidenceScore || 0}/100\n\n`;

        reportText += 'STRENGTHS:\n';
        if (Array.isArray(report.strengths)) {
            report.strengths.forEach((s: string) => {
                reportText += `• ${s}\n`;
            });
        }

        reportText += '\nAREAS FOR IMPROVEMENT:\n';
        if (Array.isArray(report.improvements)) {
            report.improvements.forEach((i: string) => {
                reportText += `• ${i}\n`;
            });
        }

        reportText += '\nDETAILED FEEDBACK:\n';
        reportText += `${report.feedback || 'No detailed feedback available'}\n\n`;

        reportText += 'PER-QUESTION FEEDBACK:\n';
        if (Array.isArray(report.perQuestionFeedback)) {
            report.perQuestionFeedback.forEach((q: any, idx: number) => {
                reportText += `\n--- Question ${idx + 1} ---\n`;
                reportText += `Question: ${q.question || 'N/A'}\n`;
                if (q.candidateAnswer) {
                    reportText += `Your Answer: ${q.candidateAnswer}\n`;
                }
                reportText += `Score: ${q.score || 0}/100\n`;
                reportText += `Feedback: ${q.feedback || 'No feedback available'}\n`;
                if (q.visualAnalysis) reportText += `Visual Analysis: ${q.visualAnalysis}\n`;
                if (q.emotion) reportText += `Emotion: ${q.emotion}\n`;
                if (q.tone) reportText += `Tone: ${q.tone}\n`;
            });
        }

        reportText += '\n\nRECOMMENDATIONS:\n';
        if (Array.isArray(report.recommendations)) {
            report.recommendations.forEach((r: string) => {
                reportText += `• ${r}\n`;
            });
        }

        reportText += '\n\nTONE ANALYSIS:\n';
        reportText += `${report.toneAnalysis || 'No tone analysis available'}\n`;

        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `interview-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const generateReport = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/generate-report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(interviewData)
                });

                if (!response.ok) {
                    throw new Error('Failed to generate report');
                }

                const data = await response.json();
                setReport(data);

                // Save interview results to database
                if (interviewData.setupData?.interviewId) {
                    try {
                        await fetch('/api/save-interview-result', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${typeof window !== 'undefined' ? (sessionStorage.getItem('token') || localStorage.getItem('token') || '') : ''}`
                            },
                            body: JSON.stringify({
                                interviewId: interviewData.setupData.interviewId,
                                overallScore: data.overallScore,
                                technicalScore: data.technicalScore,
                                communicationScore: data.communicationScore,
                                confidenceScore: data.confidenceScore,
                                duration: interviewData.duration || 0,
                                strengths: data.strengths || [],
                                improvements: data.improvements || []
                            })
                        });
                    } catch (saveError) {
                        console.error('Failed to save interview result:', saveError);
                        // Don't fail the UI if saving fails
                    }
                }
            } catch (err) {
                console.error('Report generation error:', err);
                setError(err instanceof Error ? err.message : 'Failed to generate report');
            } finally {
                setLoading(false);
            }
        };

        if (interviewData) {
            generateReport();
        }
    }, [interviewData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <div className="animate-spin mb-4">
                        <MessageSquare className="w-16 h-16 text-purple-500 mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Generating Your Report</h2>
                    <p className="text-white/70">Analyzing your interview performance...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
                    <p className="text-white/70 mb-6">{error}</p>
                    <button
                        onClick={onRestart}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">No Report Available</h2>
                    <button
                        onClick={onRestart}
                        className="mt-6 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        Start New Interview
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-white dark:bg-[#0A0F1E]">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white/50 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Interview Report</h1>
                            <p className="text-purple-600 dark:text-purple-300 text-lg">Your Performance Analysis</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={downloadReportAsPDF}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                            >
                                📥 Download Report
                            </button>
                            <button
                                onClick={onRestart}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                            >
                                New Interview
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overall Score */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <ScoreCard
                        title="Overall Score"
                        score={report.overallScore || 0}
                        color="purple"
                    />
                    <ScoreCard
                        title="Technical"
                        score={report.technicalScore || 0}
                        color="blue"
                    />
                    <ScoreCard
                        title="Communication"
                        score={report.communicationScore || 0}
                        color="green"
                    />
                    <ScoreCard
                        title="Confidence"
                        score={report.confidenceScore || 0}
                        color="pink"
                    />
                </div>

                {/* Strengths and Areas for Improvement */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Strengths */}
                    <div className="bg-white/50 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">✓ Strengths</h3>
                        <ul className="space-y-3">
                            {Array.isArray(report.strengths) && report.strengths.length > 0 ? (
                                report.strengths.map((strength: string, idx: number) => (
                                    <li key={idx} className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-gray-700 dark:text-white/90">{strength}</p>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-white/60">No strengths data available</p>
                            )}
                        </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div className="bg-white/50 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">↗ Areas for Improvement</h3>
                        <ul className="space-y-3">
                            {Array.isArray(report.improvements) && report.improvements.length > 0 ? (
                                report.improvements.map((improvement: string, idx: number) => (
                                    <li key={idx} className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-gray-700 dark:text-white/90">{improvement}</p>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-white/60">No improvement suggestions available</p>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Detailed Feedback */}
                <div className="bg-white/50 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-white/20 mb-6 shadow-sm dark:shadow-none">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📋 Detailed Feedback</h3>
                    <div className="space-y-4">
                        {report.feedback ? (
                            <p className="text-gray-700 dark:text-white/90 leading-relaxed">{report.feedback}</p>
                        ) : (
                            <p className="text-gray-500 dark:text-white/60">No detailed feedback available</p>
                        )}
                    </div>
                </div>

                {/* Performance Metrics Graph */}
                {report.performanceMetrics && (
                    <div className="bg-white/50 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-white/20 mb-6 shadow-sm dark:shadow-none">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📊 Performance Metrics</h3>
                        <div className="space-y-4">
                            {Object.entries(report.performanceMetrics).map(([key, value]: [string, any]) => (
                                <div key={key}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600 dark:text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <span className="text-purple-600 dark:text-purple-300 font-semibold">{value}%</span>
                                    </div>
                                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                                            style={{ width: `${value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Per-Question Detailed Feedback */}
                {report.perQuestionFeedback && Array.isArray(report.perQuestionFeedback) && report.perQuestionFeedback.length > 0 && (
                    <div className="bg-white/50 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-white/20 mb-6 shadow-sm dark:shadow-none">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">❓ Per-Question Feedback</h3>
                        <div className="space-y-6">
                            {report.perQuestionFeedback.map((item: any, idx: number) => (
                                <div key={idx} className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 border border-gray-200 dark:border-white/10">
                                    {/* Question */}
                                    <div className="mb-4">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Question {idx + 1}</h4>
                                        <p className="text-gray-600 dark:text-white/80 italic">{item.question || 'No question text available'}</p>
                                    </div>

                                    {/* Candidate Answer */}
                                    {item.candidateAnswer && (
                                        <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded p-4">
                                            <p className="text-blue-700 dark:text-blue-300 text-sm font-semibold mb-2">Your Answer:</p>
                                            <p className="text-gray-800 dark:text-white/90">{item.candidateAnswer}</p>
                                        </div>
                                    )}

                                    {/* Score and Progress Bar */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-gray-500 dark:text-white/70 text-sm font-semibold mb-1">Score</p>
                                            <div className="flex items-center gap-2">
                                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{Math.round(item.score || 0)}</div>
                                                <div className="text-gray-400 dark:text-white/60 text-sm">/ 100</div>
                                            </div>
                                        </div>
                                        <div className="flex-1 ml-6">
                                            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                                    style={{ width: `${Math.min(item.score || 0, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feedback */}
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-gray-500 dark:text-white/70 text-sm font-semibold mb-2">Feedback & Suggestions:</p>
                                            <p className="text-gray-700 dark:text-white/90 leading-relaxed">{item.feedback || 'No feedback available'}</p>
                                        </div>

                                        {item.visualAnalysis && (
                                            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded p-4">
                                                <p className="text-green-700 dark:text-green-300 text-sm font-semibold mb-2">📸 Visual Analysis:</p>
                                                <p className="text-gray-800 dark:text-white/90">{item.visualAnalysis}</p>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-4">
                                            {item.emotion && (
                                                <div className="flex gap-2">
                                                    <span className="text-gray-500 dark:text-white/70 text-sm">😊 Emotion:</span>
                                                    <span className="text-gray-900 dark:text-white/90 font-semibold">{item.emotion}</span>
                                                </div>
                                            )}

                                            {item.tone && (
                                                <div className="flex gap-2">
                                                    <span className="text-gray-500 dark:text-white/70 text-sm">🎤 Tone:</span>
                                                    <span className="text-gray-900 dark:text-white/90 font-semibold">{item.tone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommendations */}
                {report.recommendations && report.recommendations.length > 0 && (
                    <div className="bg-white/50 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-white/20 mb-6 shadow-sm dark:shadow-none">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🎯 Recommendations for Improvement</h3>
                        <ol className="space-y-3">
                            {report.recommendations.map((rec: string, idx: number) => (
                                <li key={idx} className="flex items-start space-x-3">
                                    <span className="text-purple-600 dark:text-purple-400 font-bold flex-shrink-0">{idx + 1}.</span>
                                    <p className="text-gray-700 dark:text-white/90">{rec}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* Tone Analysis */}
                {report.toneAnalysis && (
                    <div className="bg-white/50 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🎙️ Tone Analysis</h3>
                        <p className="text-gray-700 dark:text-white/90 leading-relaxed">{report.toneAnalysis}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportScreenComponent;
