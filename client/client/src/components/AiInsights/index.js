import React, { useState } from 'react';
import { FaMagic, FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { apiUrl } from '../../utils/api';

const severityMeta = {
    good: { icon: <FaCheckCircle />, cls: 'good' },
    neutral: { icon: <FaInfoCircle />, cls: 'neutral' },
    warning: { icon: <FaExclamationTriangle />, cls: 'warning' },
};

const AiInsights = ({ monthId }) => {
    const [status, setStatus] = useState('idle'); // idle | loading | done | error
    const [data, setData] = useState(null);
    const [errMsg, setErrMsg] = useState('');

    const generate = async () => {
        setStatus('loading');
        setErrMsg('');
        try {
            const response = await fetch(apiUrl(`/ai/insights/${monthId}`));
            const body = await response.json();
            if (response.ok) {
                setData(body);
                setStatus('done');
            } else {
                setErrMsg(body.error || 'Failed to generate insights.');
                setStatus('error');
            }
        } catch (e) {
            setErrMsg('Could not reach the server.');
            setStatus('error');
        }
    };

    return (
        <div className="ai-insights">
            <div className="ai-insights-head">
                <span className="ai-chip"><FaMagic /> AI Insights</span>
                {status !== 'loading' && (
                    <button className="btn btn-soft btn-sm" onClick={generate}>
                        {status === 'done' ? 'Regenerate' : 'Analyze this month'}
                    </button>
                )}
            </div>

            {status === 'loading' && <p className="ai-muted">Analyzing your spending...</p>}
            {status === 'error' && <p className="ai-error">{errMsg}</p>}

            {status === 'done' && data && (
                <>
                    <p className="ai-summary">{data.summary}</p>
                    <div className="ai-cards">
                        {data.insights.map((ins, i) => {
                            const meta = severityMeta[ins.severity] || severityMeta.neutral;
                            return (
                                <div key={i} className={`ai-card ${meta.cls}`}>
                                    <span className="ai-card-icon">{meta.icon}</span>
                                    <div>
                                        <h5>{ins.title}</h5>
                                        <p>{ins.detail}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default AiInsights;
