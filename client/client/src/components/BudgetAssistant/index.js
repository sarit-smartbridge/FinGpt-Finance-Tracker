import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Cookies from 'js-cookies';
import { FaRobot, FaPaperPlane, FaUser, FaLightbulb } from 'react-icons/fa';
import { apiUrl } from '../../utils/api';

const Page = styled.div`
    min-height: 100vh;
    padding: 96px 16px 28px;
    display: flex;
    justify-content: center;
    background: transparent;
`;

const Shell = styled.div`
    width: 100%;
    max-width: 820px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 124px);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0.84) 100%);
    border: 1px solid rgba(255, 255, 255, 0.76);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-3d);
    overflow: hidden;
    backdrop-filter: blur(16px) saturate(160%);
    -webkit-backdrop-filter: blur(16px) saturate(160%);
`;

const HeaderBar = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    border-bottom: 1px solid var(--line);
    background: rgba(251, 252, 253, 0.88);

    .bot {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-sm);
        display: grid;
        place-items: center;
        font-size: 18px;
        color: #fff;
        background: linear-gradient(135deg, var(--brand-600), #1d4ed8);
        box-shadow: 0 12px 24px rgba(15, 118, 110, 0.18);
    }
    h2 {
        margin: 0;
        font-size: 1.08rem;
        font-weight: 850;
        color: var(--ink-900);
    }
    p {
        margin: 2px 0 0;
        font-size: 0.84rem;
        color: var(--ink-500);
    }
`;

const Thread = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Row = styled.div`
    display: flex;
    gap: 11px;
    align-items: flex-start;
    flex-direction: ${(p) => (p.$me ? 'row-reverse' : 'row')};

    .avatar {
        width: 32px;
        height: 32px;
        border-radius: var(--radius-sm);
        flex-shrink: 0;
        display: grid;
        place-items: center;
        font-size: 14px;
        background: ${(p) => (p.$me ? 'var(--surface-2)' : 'var(--brand-soft)')};
        color: ${(p) => (p.$me ? 'var(--ink-700)' : 'var(--brand-600)')};
        border: 1px solid var(--line);
    }
    .bubble {
        max-width: 78%;
        padding: 11px 15px;
        border-radius: var(--radius);
        font-size: 0.95rem;
        line-height: 1.55;
        white-space: pre-wrap;
        border: 1px solid ${(p) => (p.$me ? 'transparent' : 'var(--line)')};
        background: ${(p) => (p.$me ? 'linear-gradient(135deg, var(--brand-600), #1d4ed8)' : 'rgba(243, 245, 247, 0.9)')};
        color: ${(p) => (p.$me ? '#fff' : 'var(--ink-700)')};
        border-bottom-${(p) => (p.$me ? 'right' : 'left')}-radius: 4px;
    }
`;

const Suggestions = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 22px 12px;

    button {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: var(--surface);
        border: 1px solid var(--line);
        color: var(--ink-700);
        border-radius: 999px;
        padding: 7px 14px;
        font-size: 0.84rem;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.15s ease;
    }
    button:hover {
        background: var(--brand-soft);
        border-color: #bfe0dc;
        color: var(--brand-700);
    }
    button svg { color: var(--brand-600); }
`;

const Composer = styled.form`
    display: flex;
    gap: 10px;
    padding: 16px 18px;
    border-top: 1px solid var(--line);
    background: rgba(251, 252, 253, 0.88);

    input {
        flex: 1;
        border-radius: var(--radius-sm);
        border: 1px solid var(--line-strong);
        background: #fff;
        color: var(--ink-900);
        padding: 0.65rem 1rem;
        outline: none;
    }
    input:focus {
        border-color: var(--brand-500);
        box-shadow: var(--ring);
    }
    button {
        width: 46px;
        border: none;
        border-radius: var(--radius-sm);
        color: #fff;
        cursor: pointer;
        background: linear-gradient(135deg, var(--brand-600), #1d4ed8);
        box-shadow: 0 10px 20px rgba(15, 118, 110, 0.18);
    }
    button:hover:not(:disabled) { background: var(--brand-700); }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const STARTERS = [
    'How can I cut my monthly expenses?',
    'Suggest a realistic budget for me',
    'Where am I overspending?',
];

const BudgetAssistant = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi, I am your budgeting assistant. Ask me about spending, savings, or budgeting, and I will base answers on your real data." },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const threadRef = useRef(null);

    useEffect(() => {
        if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }, [messages, loading]);

    const send = async (text) => {
        const content = (text ?? input).trim();
        if (!content || loading) return;

        const next = [...messages, { role: 'user', content }];
        setMessages(next);
        setInput('');
        setLoading(true);

        try {
            const userId = Cookies.getItem('userId');
            const apiMessages = next.filter((message) => message.role === 'user' || message.role === 'assistant');
            const response = await fetch(apiUrl('/ai/chat'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, messages: apiMessages }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
            } else {
                setMessages((prev) => [...prev, { role: 'assistant', content: data.error || 'Something went wrong.' }]);
            }
        } catch (e) {
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Could not reach the assistant. Is the server running?' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page>
            <Shell className="animate-up">
                <HeaderBar>
                    <span className="bot"><FaRobot /></span>
                    <div>
                        <h2>Budgeting Assistant</h2>
                        <p>Grounded in your real income and expenses</p>
                    </div>
                </HeaderBar>

                <Thread ref={threadRef}>
                    {messages.map((message, index) => (
                        <Row key={index} $me={message.role === 'user'}>
                            <span className="avatar">{message.role === 'user' ? <FaUser /> : <FaRobot />}</span>
                            <div className="bubble">{message.content}</div>
                        </Row>
                    ))}
                    {loading && (
                        <Row $me={false}>
                            <span className="avatar"><FaRobot /></span>
                            <div className="bubble">Thinking...</div>
                        </Row>
                    )}
                </Thread>

                {messages.length <= 1 && (
                    <Suggestions>
                        {STARTERS.map((starter) => (
                            <button type="button" key={starter} onClick={() => send(starter)}>
                                <FaLightbulb /> {starter}
                            </button>
                        ))}
                    </Suggestions>
                )}

                <Composer onSubmit={(e) => { e.preventDefault(); send(); }}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your budget..."
                    />
                    <button type="submit" disabled={loading || !input.trim()}><FaPaperPlane /></button>
                </Composer>
            </Shell>
        </Page>
    );
};

export default BudgetAssistant;
