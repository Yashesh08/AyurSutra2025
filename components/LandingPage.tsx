import React, { useEffect, useRef, useState, useMemo } from 'react';
import { LeafIcon } from './icons/LeafIcon';
import { ZapIcon } from './icons/ZapIcon';
import { HeartIcon } from './icons/HeartIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { Card } from './GlowingCard';
import { DetoxIcon } from './icons/DetoxIcon';
import { DigestionIcon } from './icons/DigestionIcon';
import { Logo } from './icons/Logo';
import { VamanaIcon } from './icons/VamanaIcon';
import { VirechanaIcon } from './icons/VirechanaIcon';
import { BastiIcon } from './icons/BastiIcon';
import { NasyaIcon } from './icons/NasyaIcon';
import { RaktamokshanaIcon } from './icons/RaktamokshanaIcon';
import { QuoteIcon } from './icons/QuoteIcon';
import { useTranslation } from '../i18n';

interface LandingPageProps {
    onLoginClick?: () => void;
}

// --- Animation Hook & Component ---

const useIntersectionObserver = (options: IntersectionObserverInit & { triggerOnce?: boolean }) => {
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
    const [node, setNode] = useState<HTMLElement | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new window.IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setEntry(entry);
                if (options?.triggerOnce && node) {
                    observer.current?.unobserve(node);
                }
            }
        }, options);

        const { current: currentObserver } = observer;
        if (node) currentObserver.observe(node);

        return () => currentObserver.disconnect();
    }, [node, options]);

// Fix: Add 'as const' to ensure the return type is a tuple, fixing type inference issues.
    return [setNode, entry?.isIntersecting] as const;
};

type AnimationType = 'fade-in-up' | 'slide-in-left' | 'slide-in-right';

// Fix: Update AnimatedComponent to correctly handle polymorphic 'as' prop and pass through additional props like 'src'.
const AnimatedComponent: React.FC<{
    children?: React.ReactNode;
    className?: string;
    animation: AnimationType;
    delay?: number; // delay in ms
    threshold?: number;
    as?: React.ElementType;
    [key: string]: any; // Allow other props
}> = ({ children, className = '', animation, delay = 0, threshold = 0.1, as: Tag = 'div', ...rest }) => {
    const [ref, isVisible] = useIntersectionObserver({ threshold, triggerOnce: true });
    
    return (
        <Tag
            ref={ref as any}
            className={`${className} transition-opacity duration-700 ${isVisible ? `opacity-100 animate-${animation}` : 'opacity-0'}`}
            style={{ animationDelay: isVisible ? `${delay}ms` : '0ms' }}
            {...rest}
        >
            {children}
        </Tag>
    );
};


// --- Sub-components ---

const Step: React.FC<{ number: string; title: string; children: React.ReactNode; }> = ({ number, title, children }) => (
     <div className="relative pl-12">
        <div className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center bg-saffron/20 text-saffron font-bold rounded-full border-2 border-saffron">
            {number}
        </div>
        <h3 className="text-xl font-bold font-display text-text-dark">{title}</h3>
        <p className="text-text-soft mt-1">{children}</p>
    </div>
);

const StarRating: React.FC<{ rating: number, className?: string }> = ({ rating, className }) => (
    <div className={`flex ${className}`}>
        {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-saffron' : 'text-border-soft'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

// --- Main Landing Page Component ---

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const [fiveActionsIndex, setFiveActionsIndex] = useState(0);
    const [isFiveActionsPaused, setIsFiveActionsPaused] = useState(false);
    const { t, language, setLanguage } = useTranslation();

    const [testimonialsIndex, setTestimonialsIndex] = useState(0);
    const [isTestimonialsPaused, setIsTestimonialsPaused] = useState(false);

    const fiveActions = useMemo(() => [
        { title: t('vamana_title'), description: t('vamana_desc'), icon: <VamanaIcon className="w-12 h-12 text-earthy-green"/> },
        { title: t('virechana_title'), description: t('virechana_desc'), icon: <VirechanaIcon className="w-12 h-12 text-earthy-green"/> },
        { title: t('basti_title'), description: t('basti_desc'), icon: <BastiIcon className="w-12 h-12 text-earthy-green"/> },
        { title: t('nasya_title'), description: t('nasya_desc'), icon: <NasyaIcon className="w-12 h-12 text-earthy-green"/> },
        { title: t('raktamokshana_title'), description: t('raktamokshana_desc'), icon: <RaktamokshanaIcon className="w-12 h-12 text-earthy-green"/> }
    ], [t]);

    const testimonials = useMemo(() => [
        { rating: 5, quote: t('testimonial1_quote'), avatar: "https://i.pravatar.cc/150?u=user1", name: t('testimonial1_name'), role: t('testimonial1_role') },
        { rating: 5, quote: t('testimonial2_quote'), avatar: "https://i.pravatar.cc/150?u=user2", name: t('testimonial2_name'), role: t('testimonial2_role') },
        { rating: 5, quote: t('testimonial3_quote'), avatar: "https://i.pravatar.cc/150?u=user3", name: t('testimonial3_name'), role: t('testimonial3_role') }
    ], [t]);


    useEffect(() => {
        if (isFiveActionsPaused) return;
        const interval = setInterval(() => {
            setFiveActionsIndex(prev => (prev + 1) % fiveActions.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [isFiveActionsPaused, fiveActions.length]);

    useEffect(() => {
        if (isTestimonialsPaused) return;
        const interval = setInterval(() => {
            setTestimonialsIndex(prev => (prev + 1) % testimonials.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [isTestimonialsPaused, testimonials.length]);
    
    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as 'en' | 'hi');
    };

    return (
        <div className="min-h-screen bg-ivory font-sans text-text-dark overflow-y-auto overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-20 p-4 bg-ivory/80 backdrop-blur-sm border-b border-border-soft flex justify-between items-center">
                <div className="flex items-center">
                     <Logo size={40} />
                    <h1 className="text-xl font-bold ml-2 font-display">AyurSetu</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                          value={language}
                          onChange={handleLanguageChange}
                          className="py-2 pl-3 pr-8 bg-sand border border-border-soft rounded-md text-text-dark focus:outline-none focus:ring-2 focus:ring-saffron appearance-none text-sm"
                          aria-label="Select language"
                        >
                          <option value="en">English</option>
                          <option value="hi">हिंदी</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-soft pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    <button onClick={onLoginClick} className="bg-sand px-4 py-2 rounded-md text-text-dark font-semibold hover:bg-saffron hover:text-white transition-colors">
                        {t('login_signup')}
                    </button>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative h-screen flex items-center justify-center text-center hero-bg">
                     <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 container mx-auto px-4 text-white">
                        <h2 
                            className="text-4xl sm:text-5xl md:text-6xl font-bold font-display leading-tight animate-fade-in-up" 
                            style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}
                            dangerouslySetInnerHTML={{ __html: t('landing_title') }}
                        >
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-ivory/90 animate-fade-in-up" style={{ animationDelay: '300ms', textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}>
                            {t('landing_subtitle')}
                        </p>
                        <button onClick={onLoginClick} className="mt-8 flex items-center mx-auto bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-lg hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                            {t('begin_journey')} <ChevronRightIcon className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </section>
                
                {/* What is Panchakarma? */}
                <section className="py-16 sm:py-20 bg-sand">
                    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                        <AnimatedComponent animation="slide-in-left" className="text-left">
                            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-dark mb-4">{t('what_is_panchakarma')}</h2>
                            <p className="text-text-soft mb-4">{t('panchakarma_desc_1')}</p>
                            <p className="text-text-soft">{t('panchakarma_desc_2')}</p>
                        </AnimatedComponent>
                         <div className="relative min-h-[450px] sm:min-h-[420px]">
                            <AnimatedComponent
                                as="img"
                                animation="fade-in-up"
                                delay={200}
                                src="https://images.unsplash.com/photo-1598231234123-ef2ef1993c1d?q=80&w=1974&auto=format&fit=crop"
                                alt="Ayurvedic herbs and oils"
                                className="absolute top-0 right-0 w-3/4 h-auto object-cover rounded-2xl shadow-xl border-4 border-white"
                            />
                            <AnimatedComponent
                                as={Card}
                                animation="fade-in-up"
                                delay={400}
                                className="absolute bottom-0 left-0 w-full sm:w-4/5 md:w-3/4 bg-ivory/80 backdrop-blur-sm p-4 sm:p-6 shadow-lg"
                            >
                                <h3 className="text-lg sm:text-xl font-bold font-display text-text-dark mb-4">{t('core_benefits')}</h3>
                                <ul className="space-y-3 text-left">
                                    <li className="flex items-start">
                                        <DetoxIcon className="w-6 h-6 text-earthy-green mr-3 mt-1 flex-shrink-0"/>
                                        <div>
                                            <h4 className="font-semibold text-text-dark">{t('deep_detox')}</h4>
                                            <p className="text-sm text-text-soft">{t('deep_detox_desc')}</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <ZapIcon className="w-6 h-6 text-saffron mr-3 mt-1 flex-shrink-0"/>
                                        <div>
                                            <h4 className="font-semibold text-text-dark">{t('restored_vitality')}</h4>
                                            <p className="text-sm text-text-soft">{t('restored_vitality_desc')}</p>
                                        </div>
                                    </li>
                                     <li className="flex items-start">
                                        <HeartIcon className="w-6 h-6 text-calm-blue mr-3 mt-1 flex-shrink-0"/>
                                        <div>
                                            <h4 className="font-semibold text-text-dark">{t('stress_reduction')}</h4>
                                            <p className="text-sm text-text-soft">{t('stress_reduction_desc')}</p>
                                        </div>
                                    </li>
                                </ul>
                            </AnimatedComponent>
                        </div>
                    </div>
                </section>

                {/* The Five Actions */}
                <section className="py-16 sm:py-20 bg-ivory">
                    <div className="container mx-auto px-4 text-center">
                        <AnimatedComponent animation="fade-in-up">
                            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-dark">{t('five_actions_title')}</h2>
                            <p className="mt-2 max-w-2xl mx-auto text-text-soft">{t('five_actions_desc')}</p>
                        </AnimatedComponent>
                        <div className="mt-12">
                            {/* Carousel for mobile */}
                            <div className="md:hidden">
                                <div
                                    className="relative w-64 mx-auto overflow-hidden"
                                    onMouseEnter={() => setIsFiveActionsPaused(true)}
                                    onMouseLeave={() => setIsFiveActionsPaused(false)}
                                    onTouchStart={() => setIsFiveActionsPaused(true)}
                                    onTouchEnd={() => setIsFiveActionsPaused(false)}
                                >
                                    <div
                                        className="flex transition-transform duration-500 ease-in-out"
                                        style={{ transform: `translateX(-${fiveActionsIndex * 100}%)` }}
                                    >
                                        {fiveActions.map((action, index) => (
                                            <div key={index} className="w-full flex-shrink-0 p-1">
                                                <Card className="text-center p-4 sm:p-6 h-full flex flex-col">
                                                    <div className="w-20 h-20 mx-auto bg-ivory rounded-full flex items-center justify-center border-2 border-border-soft shadow-sm mb-4">
                                                        {action.icon}
                                                    </div>
                                                    <h4 className="font-bold text-lg sm:text-xl font-display text-earthy-green">{action.title}</h4>
                                                    <p className="text-sm text-text-soft mt-2 flex-grow">{action.description}</p>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-center items-center mt-4 space-x-2">
                                    {fiveActions.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setFiveActionsIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-colors ${fiveActionsIndex === index ? 'bg-saffron' : 'bg-border-soft'}`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        ></button>
                                    ))}
                                </div>
                            </div>
                            {/* Static grid for tablet/desktop */}
                            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {fiveActions.map((action, index) => (
                                    <AnimatedComponent key={action.title} as={Card} animation="fade-in-up" delay={index * 100} className="text-center p-4 sm:p-6">
                                        <div className="w-20 h-20 mx-auto bg-ivory rounded-full flex items-center justify-center border-2 border-border-soft shadow-sm mb-4">
                                            {action.icon}
                                        </div>
                                        <h4 className="font-bold text-lg sm:text-xl font-display text-earthy-green">{action.title}</h4>
                                        <p className="text-sm text-text-soft mt-2">{action.description}</p>
                                    </AnimatedComponent>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16 sm:py-20 bg-sand">
                     <div className="container mx-auto px-4">
                         <AnimatedComponent animation="fade-in-up" className="text-center">
                            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-dark">{t('your_journey_title')}</h2>
                            <p className="mt-2 max-w-2xl mx-auto text-text-soft">{t('your_journey_desc')}</p>
                         </AnimatedComponent>
                         <div className="mt-12 max-w-2xl mx-auto space-y-10">
                             <AnimatedComponent animation="fade-in-up" delay={0}><Step number="1" title={t('step1_title')}>{t('step1_desc')}</Step></AnimatedComponent>
                             <AnimatedComponent animation="fade-in-up" delay={200}><Step number="2" title={t('step2_title')}>{t('step2_desc')}</Step></AnimatedComponent>
                             <AnimatedComponent animation="fade-in-up" delay={400}><Step number="3" title={t('step3_title')}>{t('step3_desc')}</Step></AnimatedComponent>
                         </div>
                    </div>
                </section>
                
                {/* Testimonials */}
                 <section className="py-16 sm:py-20 bg-ivory">
                    <div className="container mx-auto px-4">
                        <AnimatedComponent animation="fade-in-up" className="text-center">
                           <h2 className="text-3xl md:text-4xl font-bold font-display text-text-dark">{t('testimonials_title')}</h2>
                        </AnimatedComponent>
                        <div className="mt-12">
                            {/* Carousel for mobile */}
                            <div className="md:hidden">
                                <div
                                    className="relative w-80 mx-auto overflow-hidden"
                                    onMouseEnter={() => setIsTestimonialsPaused(true)}
                                    onMouseLeave={() => setIsTestimonialsPaused(false)}
                                    onTouchStart={() => setIsTestimonialsPaused(true)}
                                    onTouchEnd={() => setIsTestimonialsPaused(false)}
                                >
                                    <div
                                        className="flex transition-transform duration-500 ease-in-out"
                                        style={{ transform: `translateX(-${testimonialsIndex * 100}%)` }}
                                    >
                                        {testimonials.map((testimonial, index) => (
                                            <div key={index} className="w-full flex-shrink-0 p-2">
                                                <Card className="relative overflow-hidden text-center h-full flex flex-col p-6">
                                                    <QuoteIcon className="absolute -top-2 -left-4 w-24 h-24 text-sand" />
                                                    <div className="relative z-10 flex flex-col h-full">
                                                        <StarRating rating={testimonial.rating} className="justify-center"/>
                                                        <p className="text-text-soft italic my-4 flex-grow">{testimonial.quote}</p>
                                                        <div className="flex items-center justify-center mt-auto">
                                                            <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 border-2 border-saffron"/>
                                                            <div>
                                                                <div className="font-semibold text-text-dark">{testimonial.name}</div>
                                                                <div className="text-sm text-text-soft">{testimonial.role}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-center items-center mt-4 space-x-2">
                                    {testimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setTestimonialsIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-colors ${testimonialsIndex === index ? 'bg-saffron' : 'bg-border-soft'}`}
                                            aria-label={`Go to story ${index + 1}`}
                                        ></button>
                                    ))}
                                </div>
                            </div>
                            {/* Static grid for tablet/desktop */}
                            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
                                {testimonials.map((testimonial, index) => (
                                    <AnimatedComponent key={index} as={Card} animation="fade-in-up" delay={index * 200} className="relative overflow-hidden text-center">
                                        <QuoteIcon className="absolute -top-2 -left-4 w-24 h-24 text-sand" />
                                        <div className="relative z-10 flex flex-col h-full p-6">
                                            <StarRating rating={testimonial.rating} className="justify-center"/>
                                            <p className="text-text-soft italic my-4 flex-grow">{testimonial.quote}</p>
                                            <div className="flex items-center justify-center mt-auto">
                                                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 border-2 border-saffron"/>
                                                <div>
                                                    <div className="font-semibold text-text-dark">{testimonial.name}</div>
                                                    <div className="text-sm text-text-soft">{testimonial.role}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </AnimatedComponent>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="cta-bg">
                    <div className="container mx-auto px-4 py-16 text-center bg-earthy-green/70">
                        <AnimatedComponent animation="fade-in-up">
                             <h2 className="text-3xl md:text-4xl font-bold font-display text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>{t('cta_title')}</h2>
                             <p className="mt-2 max-w-2xl mx-auto text-ivory/90" style={{textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}>{t('cta_desc')}</p>
                             <button onClick={onLoginClick} className="mt-8 flex items-center mx-auto bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
                                {t('cta_button')} <ChevronRightIcon className="w-5 h-5 ml-2" />
                            </button>
                        </AnimatedComponent>
                    </div>
                </section>
            </main>
            
             {/* Footer */}
            <footer className="py-6 bg-sand text-center text-text-soft text-sm border-t border-border-soft">
                <p>{t('footer_text', { year: new Date().getFullYear() })}</p>
            </footer>
        </div>
    );
};