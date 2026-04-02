/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Menu, 
  X,
  ChevronRight,
  BarChart3,
  Rocket,
  Search
} from 'lucide-react';
import { auth, db } from './firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

// --- Components ---

const Navbar = ({ user, onLogin, onLogout }: { user: User | null, onLogin: () => void, onLogout: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Resultados', href: '#cases' },
    { name: 'Metodologia', href: '#methodology' },
    { name: 'Web Dev', href: '#web-dev' },
    { name: 'Sobre', href: '#about' },
    { name: 'Contato', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/Wise.png" 
            alt="Wise Assessoria Logo" 
            className="h-20 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors uppercase tracking-widest">
              {link.name}
            </a>
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-orange-500" />
              <button onClick={onLogout} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Sair</button>
            </div>
          ) : (
            <button onClick={onLogin} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105">
              Área do Cliente
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black border-t border-white/10 p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-300 hover:text-orange-500"
                >
                  {link.name}
                </a>
              ))}
              <button onClick={onLogin} className="bg-orange-500 text-white py-3 rounded-xl font-bold">
                Área do Cliente
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3" /> Assessoria de Marketing Estratégico
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Escale sua <span className="text-orange-500">Geração de Receita</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
            Combinamos estratégia, tecnologia e execução para atrair demanda qualificada, alinhar marketing e comercial e escalar seu negócio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#cases" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all transform hover:translate-y-[-2px] shadow-lg shadow-orange-500/20">
              Ver cases de sucesso <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#methodology" className="border border-white/20 hover:border-orange-500 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all">
              Nossa Metodologia
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src="/WiseV.jpg" 
              alt="Team working" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="text-white w-6 h-6" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">+250%</div>
                  <div className="text-gray-400 text-xs uppercase tracking-widest">Crescimento Médio</div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-orange-500/20 rounded-full animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 border border-orange-500/10 rounded-full animate-pulse delay-700" />
        </motion.div>
      </div>
    </section>
  );
};

const Process = () => {
  const steps = [
    {
      title: "Entendendo onde você está",
      description: "Analisamos seu cenário atual, processos e gargalos para identificar as reais oportunidades de crescimento.",
      icon: <Search className="w-6 h-6" />
    },
    {
      title: "O que sua empresa realmente precisa",
      description: "Definimos as estratégias e ferramentas ideais para o seu momento, sem desperdício de tempo ou recursos.",
      icon: <Target className="w-6 h-6" />
    },
    {
      title: "Plano de ação estratégico",
      description: "Entregamos um roadmap claro e executável para escalar sua geração de demanda e receita.",
      icon: <Zap className="w-6 h-6" />
    }
  ];

  return (
    <section className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Receba um plano de ação <span className="text-orange-500 text-nowrap">claro e estratégico</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Criado especialmente para que sua empresa possa escalar cada vez mais.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="p-8 rounded-3xl bg-black border border-white/5 hover:border-orange-500/50 transition-all group">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Methodology = () => {
  const steps = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Captação",
      desc: "Estratégias avançadas para atrair o público ideal e gerar demanda qualificada de forma constante."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Receita",
      desc: "Foco total na conversão e no fechamento de negócios, transformando leads em faturamento real."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Engajamento",
      desc: "Fortalecimento do relacionamento com o cliente para garantir satisfação e recorrência."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Monetização",
      desc: "Maximização do valor de cada cliente através de estratégias de up-sell e cross-sell."
    }
  ];

  return (
    <section id="methodology" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">Metodologia Wise Assessoria</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6">Como impulsionamos seu negócio</h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Receba um plano de ação claro e estratégico, criado especialmente para que sua empresa possa escalar cada vez mais.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="grid gap-8">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="p-8 rounded-3xl bg-black border border-white/5 hover:border-orange-500/50 transition-all group flex gap-6 items-start"
                >
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-orange-500/20 blur-[120px] rounded-full" />
              <img 
                src="/Gemini_Generated_Image_dcda0rdcda0rdcda.png" 
                alt="Metodologia Wise Assessoria Cycle" 
                className="relative z-10 w-full max-w-lg mx-auto drop-shadow-[0_0_50px_rgba(249,115,22,0.3)]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Results = () => {
  const results = [
    { label: "Investimento Gerenciado", value: "R$ 800k+" },
    { label: "Leads Qualificados", value: "100k+" },
    { label: "Empresas Atendidas", value: "55+" },
    { label: "Crescimento Médio", value: "250%" }
  ];

  return (
    <section id="cases" className="py-24 bg-zinc-950 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {results.map((res, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-orange-500 mb-2">{res.value}</div>
              <div className="text-gray-400 text-xs uppercase tracking-widest font-bold">{res.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500/20 blur-[100px] rounded-full" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                Na <span className="text-orange-500">Wise Assessoria</span>, vivemos aquilo que ensinamos.
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Somos especialistas em impulsionar, educar e acelerar empresas, unindo estratégias de marketing digital, tráfego pago e estruturação de processos de vendas para gerar crescimento real.
              </p>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Nosso time é movido por resultados e trabalha lado a lado com nossos clientes para criar soluções sob medida, que transformam desafios em oportunidades e ajudam empresas a atrair mais clientes, vender mais e crescer de forma previsível.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                  <div className="text-orange-500 font-bold mb-1">Estratégia</div>
                  <div className="text-gray-500 text-sm">Focada em ROI</div>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                  <div className="text-orange-500 font-bold mb-1">Tecnologia</div>
                  <div className="text-gray-500 text-sm">Dados e Automação</div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="aspect-square rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-white/10">
              <img 
                src="/WiseV.jpg" 
                alt="Wise Assessoria Team" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-orange-500 p-8 rounded-3xl shadow-2xl">
              <div className="text-white font-black text-4xl mb-1">100%</div>
              <div className="text-white/80 text-sm font-bold uppercase tracking-wider">Foco em Resultados</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SelfAssessment = () => {
  const items = [
    "Preciso de mais leads qualificados para o meu time de vendas.",
    "Meu marketing e comercial não estão alinhados.",
    "Não sei quanto retorno meu investimento em marketing está gerando.",
    "Minha empresa parou de crescer e não sei o porquê.",
    "Preciso de um processo de vendas previsível e escalável.",
    "Quero profissionalizar minha presença digital e autoridade."
  ];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-3xl md:text-4xl font-black text-white mb-12">
          Sua empresa se identifica com <span className="text-orange-500 text-nowrap">estes desafios?</span>
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-left mb-12">
          {items.map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
              </div>
              <span className="text-gray-300 text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
        <div className="p-8 rounded-3xl bg-orange-500/10 border border-orange-500/20">
          <p className="text-white font-bold text-lg mb-4">
            Se você se identificou com pelo menos 3 alternativas, a Wise Assessoria está pronta para levar sua empresa ao próximo nível.
          </p>
          <a href="#contact" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-all">
            Solicitar Diagnóstico Gratuito <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

const WebDevelopment = () => {
  return (
    <section id="web-dev" className="py-24 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">Desenvolvimento Web</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-8">Sua presença digital com performance máxima</h3>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Não criamos apenas sites. Desenvolvemos máquinas de conversão otimizadas para velocidade, SEO e experiência do usuário. 
              Sua landing page ou site institucional será o pilar central da sua estratégia de marketing.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Landing Pages de Alta Conversão",
                "Sites Institucionais Modernos",
                "Otimização de Velocidade (Core Web Vitals)",
                "Design Responsivo e Mobile-First",
                "Integração com CRM e Ferramentas de Marketing"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="/WiseW.jpeg" 
                alt="Web Development" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-orange-500 p-6 rounded-2xl shadow-xl hidden md:block">
              <div className="text-white font-black text-3xl">100%</div>
              <div className="text-orange-100 text-xs font-bold uppercase tracking-wider">Otimizado para Conversão</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.name.trim()) {
      setStatus('error');
      setErrorMessage('Por favor, insira seu nome completo.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      setStatus('error');
      setErrorMessage('Por favor, insira seu e-mail.');
      return;
    } else if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setErrorMessage('Por favor, insira um e-mail válido.');
      return;
    }
    
    if (!formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Por favor, descreva como podemos ajudar.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    try {
      console.log('Starting form submission...');
      
      // 1. Save to Firestore
      try {
        const leadsRef = collection(db, 'leads');
        await addDoc(leadsRef, {
          ...formData,
          createdAt: serverTimestamp(),
          uid: auth.currentUser?.uid || 'anonymous'
        });
        console.log('Successfully saved to Firestore');
      } catch (dbErr: any) {
        console.error('Firestore save error:', dbErr);
        // We continue even if Firestore fails, to try sending the email
      }

      // 2. Send Email via Backend
      let emailResponse;
      try {
        emailResponse = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (fetchErr) {
        console.error('Fetch error:', fetchErr);
        throw new Error('Erro de conexão: Não foi possível conectar ao servidor. Verifique sua internet.');
      }

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.error || errorData.details || 'Falha ao enviar e-mail.');
      }

      console.log('Form submission successful');
      setStatus('success');
      setShowModal(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">Contato</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-8">Pronto para o próximo passo?</h3>
            <p className="text-gray-400 text-lg mb-12 leading-relaxed">
              Envie suas informações e receba um plano de ação estratégico para sua empresa. Todos os seus dados estarão seguros.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-white font-bold mb-1">E-mail</div>
                  <div className="text-gray-400">wiseassessoriademarketing@gmail.com</div>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-white font-bold mb-1">Telefone</div>
                  <div className="text-gray-400">+55 (11) 99815-4346</div>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-white font-bold mb-1">Endereço</div>
                  <div className="text-gray-400">São Paulo, SP - Brasil</div>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href="https://wa.me/5511998154346" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-green-600/20"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Ou converse direto pelo Whatsapp
                </a>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-black p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl"
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div>
                <label className="block text-white text-sm font-bold mb-2">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                  placeholder="Seu nome"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-bold mb-2">E-mail</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-bold mb-2">WhatsApp</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white text-sm font-bold mb-2">Como podemos ajudar?</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-all resize-none"
                  placeholder="Descreva sua necessidade"
                />
              </div>
              <button 
                disabled={status === 'loading'}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${status === 'success' ? 'bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                {status === 'loading' ? 'Enviando...' : status === 'success' ? 'Mensagem Enviada!' : 'Solicitar Plano de Ação'}
                <Rocket className="w-5 h-5" />
              </button>
              {status === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-500 text-sm text-center font-medium whitespace-pre-wrap">{errorMessage}</p>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-white/10 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Mensagem Recebida!</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Obrigado pelo seu interesse. Nossa equipe analisará suas informações e entrará em contato em breve com seu plano de ação estratégico.
              </p>
              <button 
                onClick={() => setShowModal(false)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold transition-all"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <img 
            src="/Wise.png" 
            alt="Wise Assessoria Logo" 
            className="h-20 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Wise Assessoria. Todos os direitos reservados.
        </div>
        <div className="flex gap-8 items-center">
          {[
            { 
              name: 'Instagram', 
              href: 'https://www.instagram.com/wiseassessoria_?igsh=MWRtdzdmZXplbWUxcQ==',
              icon: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.ciafoodies.com%2Fwp-content%2Fthemes%2Ffoodica-child%2Fimages%2Finstagram-orange.png&f=1&nofb=1&ipt=9e9fb284beaf1cc92d45e283fd41a1398d8aa88729eb888b29e5651381651ee1'
            },
            { name: 'LinkedIn', href: '#' },
            { name: 'YouTube', href: '#' }
          ].map(social => (
            <a 
              key={social.name} 
              href={social.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors text-sm font-medium"
            >
              {social.icon && (
                <img 
                  src={social.icon} 
                  alt={`${social.name} Icon`} 
                  className="w-8 h-8 object-contain opacity-60 group-hover:opacity-100 transition-all transform group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              )}
              <span>{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        console.log('User closed the login popup.');
      } else {
        console.error('Login error:', err);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="bg-black min-h-screen font-sans selection:bg-orange-500 selection:text-white">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      
      <main>
        <Hero />
        <Results />
        <Process />
        <Methodology />
        <About />
        <SelfAssessment />
        <WebDevelopment />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
