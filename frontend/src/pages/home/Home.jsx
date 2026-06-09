import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { uiConfig } from "../../utils/uiConfig";
import { homeContent } from "../../content/homeContent";
import Aitoolcard from "../../components/partials/Aitoolcard";
import FlowStep from "../../components/partials/FlowStep";
import heroVideo from "../../assets/208521_medium.mp4";
import { useRole } from "../../context/RoleContext";

function AnimatedCounter({ value }) {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const parsed = /^([0-9]+(?:\.[0-9]+)?)(.*)$/.exec(value.toString().trim());
    if (!parsed) {
      setDisplayValue(value.toString());
      return;
    }

    const target = Number(parsed[1]);
    const suffix = parsed[2] || "";
    const duration = 1200;
    let animationFrame;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(target * progress);
      setDisplayValue(`${current}${suffix}`);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(`${Math.round(target)}${suffix}`);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return <span>{displayValue}</span>;
}

import assistantImg from "../../assets/images/AI Agriculture Assistant.png";
import marketIntelImg from "../../assets/images/Commodity Market Intelligence.png";
import weatherIntelImg from "../../assets/images/Weather & Reservoir Intel.png";
import govSchemesImg from "../../assets/images/Government Scheme Center.png";
import researchAiImg from "../../assets/images/White Paper & Research AI.png";
import diseaseDetImg from "../../assets/images/Disease Detection Module.png";
import cropRecImg from "../../assets/images/Smart Crop Recommendation.png";
import newsIntelImg from "../../assets/images/News Intelligence Module.png";
import marketplaceImg from "../../assets/images/Marketplace Module.png";
import learningHubImg from "../../assets/images/Learning Hub.png";

const moduleImages = {
  "ai-assistant": assistantImg,
  "market-intel": marketIntelImg,
  "weather-intel": weatherIntelImg,
  "gov-schemes": govSchemesImg,
  "research-ai": researchAiImg,
  "disease-det": diseaseDetImg,
  "crop-rec": cropRecImg,
  "news-intel": newsIntelImg,
  marketplace: marketplaceImg,
  "learning-hub": learningHubImg,
};

export default function Home() {
  const navigate = useNavigate();
  const { hero, metrics, aiTools, platformFlow } = homeContent;
  const { activeRole } = useRole();

  return (
    <div className="bg-white dark:bg-brand-darkest min-h-screen text-slate-800 dark:text-white font-sans transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-brand-darkest text-white pt-24 pb-20 lg:pt-28 lg:pb-24">
        {/* Background Video (Fully Visible) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 dark:opacity-60"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div
          className={`${uiConfig.layout.container} relative z-10 text-center`}
        >
          {/* Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-light/10 border border-brand-light/20 mb-6 animate-fadeIn">
            <span className="h-2 w-2 rounded-full bg-brand-accent animate-ping" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">
              {hero.badge}
            </span>
          </div>

          {/* Main Heading (Reduced Font Size) */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] max-w-4xl mx-auto mb-4">
            {hero.titlePrefix}{" "}
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-brand-light to-white">
              {hero.titleHighlight}
            </span>
          </h1>

          {/* Subtitle (Reduced Font Size) */}
          <p className="text-xs sm:text-sm lg:text-base text-slate-300/90 leading-relaxed max-w-2xl mx-auto mb-8">
            {hero.subtitle}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10">
            <button
              type="button"
              onClick={() => {
                navigate("/module/crop-recommendation");
              }}
              className={`${uiConfig.styles.buttonAccent} w-full sm:w-auto flex items-center justify-center space-x-2 cursor-pointer`}
            >
              <span>{hero.ctaPrimary}</span>
              <LucideIcons.ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("platform");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className={`${uiConfig.styles.buttonOutline} w-full sm:w-auto flex items-center justify-center space-x-2 cursor-pointer`}
            >
              <LucideIcons.Play className="h-4 w-4 fill-white" />
              <span>{hero.ctaSecondary}</span>
            </button>
          </div>

          {/* Core Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] sm:text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              <LucideIcons.CheckCircle className="h-3.5 w-3.5 text-brand-accent" />{" "}
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <LucideIcons.ShieldCheck className="h-3.5 w-3.5 text-brand-accent" />{" "}
              GDPR & Soil Data Privacy Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <LucideIcons.Zap className="h-3.5 w-3.5 text-brand-accent" />{" "}
              Millisecond predictions
            </span>
          </div>
        </div>
      </section>

      {/* 2. FLOATING METRICS RIBBON */}
      <section className="relative z-20 -mt-16 sm:-mt-20">
        <div className={uiConfig.layout.container}>
          <div className="bg-white dark:bg-brand-darkest border border-slate-100 dark:border-brand-dark/25 shadow-2xl rounded-3xl p-8 lg:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-100 dark:divide-brand-dark/15">
              {metrics.map((item, index) => {
                const IconComponent =
                  LucideIcons[item.icon] || LucideIcons.HelpCircle;
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 px-2 sm:px-6 pt-6 sm:pt-0 first:pt-0"
                  >
                    <div className="p-3 bg-brand-medium/10 text-brand-medium dark:text-brand-accent rounded-2xl">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-3xl lg:text-4xl font-extrabold text-brand-darkest dark:text-white tracking-tight">
                          <AnimatedCounter value={item.value} />
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-brand-light/95 dark:text-brand-accent/80 mt-1 mb-0.5">
                        {item.label}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.subtext}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE MODULES SECTION */}
      <section id="ai-tools" className={uiConfig.layout.sectionPadding}>
        <div className={uiConfig.layout.container}>
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-medium/10 text-brand-medium dark:text-brand-accent text-xs font-bold uppercase tracking-widest mb-4">
              <LucideIcons.Sparkles className="h-3.5 w-3.5" />
              <span>Smart Farming Modules</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
              AI Tools for Your Farm
            </h2>
            <p className="text-gray-700 font-medium max-w-2xl text-center mx-auto text-sm md:text-base">
              Deploy modular, production-ready machine learning engines to
              monitor crop vitality, identify plant leaf pathogens, and forecast
              multi-week irrigation levels.
            </p>
          </div>

          {/* Grid Layout of Cards - Wider professional layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {aiTools.map((card) => {
              let resolvedLink = card.linkUrl;
              if (card.id === "crop-rec") {
                resolvedLink = "/module/crop-recommendation";
              }
              return (
                <Aitoolcard
                  key={card.id}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  badgeText={card.badgeText}
                  badgeColor={card.badgeColor}
                  linkUrl={resolvedLink}
                  highlighted={card.highlighted}
                  image={moduleImages[card.id]}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PLATFORM FLOW SECTION */}
      <section
        id="platform"
        className={`bg-slate-50 dark:bg-brand-darkest/40 border-y border-slate-100 dark:border-brand-dark/10 ${uiConfig.layout.sectionPadding}`}
      >
        <div className={uiConfig.layout.container}>
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-light/20 text-brand-dark dark:text-brand-accent text-xs font-bold uppercase tracking-widest mb-4">
              <span>Platform Flow</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
              From Data to Yield
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              See the direct data sequence behind AgroIndia\'s
              insights—aggregating atmospheric parameters, compiling agronomic
              recommendations, and prompting timely delivery.
            </p>
          </div>

          {/* Steps Timeline flex container */}
          <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap items-center justify-center gap-y-8 md:gap-y-12 lg:gap-y-0 w-full">
            {platformFlow.map((step, index) => (
              <FlowStep
                key={step.step}
                stepNumber={step.step}
                icon={step.icon}
                title={step.title}
                description={step.description}
                isLast={index === platformFlow.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-brand-darkest text-slate-400 py-12 border-t border-brand-dark/30">
        <div className={uiConfig.layout.container}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-brand-accent/20 rounded-lg">
                <LucideIcons.Sprout className="h-5 w-5 text-brand-accent" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                AgroIndia.
              </span>
            </div>
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} AgroIndia Inc. All rights
              reserved. Precision algorithms for global soil optimization.
            </p>
            <div className="flex space-x-6 text-xs font-semibold text-slate-400 hover:text-white transition-colors duration-200">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#support">Agronomist Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
