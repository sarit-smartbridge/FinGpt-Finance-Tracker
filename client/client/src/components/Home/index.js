import { Fragment } from "react";
import About from "../About";
import Footer from "../Footer";
import {
    HomeContainer,
    Button,
    GhostButton,
    FeatureGrid,
    StatsBar,
} from "./styledComponents";
import {
    FaArrowRight,
    FaPlusCircle,
    FaChartPie,
    FaWallet,
    FaShieldAlt,
    FaFilePdf,
    FaCheckCircle,
    FaRocket,
} from "react-icons/fa";

const features = [
    {
        icon: <FaChartPie />,
        bg: "var(--brand-soft)",
        color: "var(--brand-600)",
        title: "Clear monthly overview",
        text: "Review income, expenses, and savings for each month with concise, color-coded summaries.",
    },
    {
        icon: <FaWallet />,
        bg: "var(--income-soft)",
        color: "var(--income)",
        title: "Structured transaction tracking",
        text: "Add, edit, and delete income and expense entries in seconds so your ledger stays up to date.",
    },
    {
        icon: <FaShieldAlt />,
        bg: "var(--savings-soft)",
        color: "var(--savings)",
        title: "Spending guardrails",
        text: "See a clear alert when monthly spending crosses a healthy threshold against your income.",
    },
    {
        icon: <FaFilePdf />,
        bg: "var(--expense-soft)",
        color: "var(--expense)",
        title: "Export-ready reports",
        text: "Download a tidy monthly report for personal records, review, or sharing.",
    },
];

const Home = () => (
    <Fragment>
        <HomeContainer>
            <span className="eyebrow"><FaRocket /> Personal finance workspace</span>
            <h1 className="animate-up">
                Track income, expenses, and savings with <span className="grad">professional clarity</span>
            </h1>
            <p className="lead animate-up">
                FinGPT gives every month a structured ledger, clear totals, and useful AI-backed spending context without spreadsheet clutter.
            </p>
            <div className="cta-row animate-up">
                <Button to="/track">
                    Start Tracking <FaArrowRight />
                </Button>
                <GhostButton to="/addincome-or-expense">
                    <FaPlusCircle /> Add a Transaction
                </GhostButton>
            </div>

            <StatsBar>
                <span className="stat"><FaCheckCircle /> Private by default</span>
                <span className="stat"><FaCheckCircle /> Monthly insights</span>
                <span className="stat"><FaCheckCircle /> Clean reports</span>
            </StatsBar>

            <FeatureGrid>
                {features.map((feature) => (
                    <div className="feature" key={feature.title}>
                        <div className="icon" style={{ background: feature.bg, color: feature.color }}>
                            {feature.icon}
                        </div>
                        <h3>{feature.title}</h3>
                        <p>{feature.text}</p>
                    </div>
                ))}
            </FeatureGrid>
        </HomeContainer>
        <About />
        <Footer />
    </Fragment>
);

export default Home;
