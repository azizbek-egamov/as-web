"use client"

import { MaintenanceWrapper } from "@/components/maintenance-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Code,
  Building,
  Users,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Rocket,
  Target,
  Award,
  Sparkles,
  Brain,
  Database,
  Smartphone,
  Monitor,
  Cloud,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ProjectCarousel } from "@/components/project-carousel"
import { PartnersCarousel } from "@/components/partners-carousel"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { TeamCarousel } from "@/components/team-carousel"
import { InnovativeNavbar } from "@/components/innovative-navbar"
import { InnovativeContact } from "@/components/innovative-contact"
import Link from "next/link"
import { describe } from "node:test"
import { Description } from "@radix-ui/react-alert-dialog"

// Enhanced Language translations
const translations = {
  uz: {
    nav: {
      about: "Biz Haqimizda",
      services: "Xizmatlar",
      projects: "Loyihalar",
      team: "Jamoa",
      contact: "Bog'lanish",
      a: "Xabar yuborildi!",
      b: "Tez orada siz bilan bog'lanamiz.",
    },
    hero: {
      title: "Kelajakni Bugun Yarating",
      subtitle:
        "ArdentSoft - bu sizning biznesingizni raqamli kelajakka olib boradigan innovatsion IT yechimlar kompaniyasi. Biz har bir loyihani mukammallik bilan amalga oshiramiz.",
      button: "Loyihani Boshlash",
      viewProjects: "Loyihalarni Ko'rish",
      features: {
        feature1: "24/7 Texnik Yordam",
        feature2: "AI Yechimlar",
        feature3: "Ekspert Jamoa",
        feature4: "Tezkor Yetkazib Berish",
      },
    },
    stats: {
      experience: "Yillik Tajriba",
      projects: "Muvaffaqiyatli Loyihalar",
      clients: "Baxtli Mijozlar",
      specialists: "Texnologiya Ekspertlari",
    },
    about: {
      a: "Bizning Yutuqlarimiz",
      title: "Innovatsiya Bizning DNAmizda",
      description:
        "Biz O'zbekistonning eng ilg'or IT kompaniyasimiz. Har bir loyiha uchun eng so'nggi texnologiyalar, sun'iy intellekt va cloud yechimlarini qo'llaymiz. Bizning jamoamiz - bu tajribali arxitektorlar, full-stack dasturchilar, UI/UX dizaynerlari va DevOps mutaxassislari.",
    },
    values: {
      icon: "Bizning servislar",
      innovationLeaders: "Innovatsiya Yetakchilari",

      title: "Bizning Super Kuchlarimiz",
      subtitle: "Har bir loyihada biz o'zimizning noyob yondashuvimizni qo'llaymiz",
      transparency: {
        title: "Kristal Shaffoflik",
        description: "Har bir jarayon ochiq va tushunarli. Real-time progress tracking va to'liq hisobot berish.",
      },
      speed: {
        title: "Yorug'lik Tezligi",
        description: "Agile metodologiya va CI/CD pipeline orqali loyihalarni rekord vaqtda yetkazib beramiz.",
      },
      innovation: {
        title: "Kelajak Texnologiyalari",
        description: "AI, Machine Learning, Blockchain va IoT kabi eng so'nggi texnologiyalarni qo'llaymiz.",
      },
      engineering: {
        title: "Yuqori aniqlikdagi muhandislik",
        description: "Har bir kod qatori, har bir piksel mukammal. Biz faqat eng yuqori sifatli mahsulotlar yaratamiz."
      },
      solutions: {
        title: "Sun'iy Intellekt (AI) asosidagi yechimlar",
        description: "Sun'iy intellekt va machine learning texnologiyalari bilan kuchaytirilgan yechimlar."
      },
      quality: {
        title: "Ta'rifga loyiq sifat",
        description: "Bizning ishimiz sifati xalqaro standartlarga javob beradi va ko'plab mukofotlarga sazovor bo'lgan."
      }
    },
    services: {
      title: "Bizning Super Xizmatlar",
      subtitle: "Har bir xizmat - bu sizning biznesingizni keyingi bosqichga olib chiqadigan kuchli vosita",
      "ai": {
        "title": "AI & Machine Learning",
        "description": "Sun’iy intellekt va machine learning texnologiyalari bilan kuchli yechimlar."
      },
      "cloud": {
        "title": "Cloud Architecture",
        "description": "AWS, Azure va Google Cloud platformalarida scalable va secure cloud yechimlari."
      },
      "mobile": {
        "title": "Mobile Excellence",
        "description": "React Native va Flutter yordamida native va cross-platform mobil ilovalar."
      },
      "web": {
        "title": "Web Innovation",
        "description": "Next.js, React va zamonaviy texnologiyalar asosidagi web ilovalar."
      },
      "data": {
        "title": "Data Engineering",
        "description": "Big Data, Analytics va real-time data processing yechimlari."
      },
      "security": {
        "title": "Cybersecurity",
        "description": "Enterprise-level xavfsizlik va ma’lumotlarni himoya qilish yechimlari."
      }
    },
    projects: {
      about: "Bizning Loyihalar",
      title: "Bizning Loyihalar",
      subtitle: "Har bir loyiha - bu innovatsiya va mukammallikning namunasi",
      viewAll: "Barcha Loyihalarni Ko'rish",
      viewDetails: "Batafsil ko‘rish",
    },
    team: {
      about: "Bizning Jamoa",
      title: "Bizning Dasturchilarimiz",
      subtitle: "Professional va tajribali dasturchilar jamoasi sizning loyihangizni hayotga tatbiq etadi",
    },
    contact: {
      contact_us: "Biz bilan bog'laning",
      title: "Keling, Birgalikda Yarataylik",
      subtitle: "Sizning g'oyangiz + bizning texnologiyamiz = ajoyib mahsulot. Bugun boshlaylik!",
      phone: "Telefon",
      email: "Email",
      address: "Manzil",
      form: {
        title: "Loyihani Boshlash",
        name: "To'liq Ism",
        namePlaceholder: "Ismingizni kiriting",
        phoneLabel: "Telefon Raqam",
        phonePlaceholder: "+998 90 123 45 67",
        message: "Loyiha Haqida",
        messagePlaceholder: "Loyihangiz haqida batafsil ma'lumot bering...",
        submit: "Loyihani Boshlash",
      },
      texta: "24/7 qo'llab-quvvatlash",
      textb: "Tezkor javob kafolati",
      textc: "Ofisga tashrif buyuring",
      btn: "Bog'lanish",
      abc: "Toshkent, O'zbekiston",
      why: "Nega bizni tanlash kerak?",
      fast: "24 soat ichida javob",
      secur: "Ma'lumotlar xavfsizligi",
      prof: "Professional maslahat",
      result: "Bizning natijalar",
      a: "Mijozlar mamnunligi",
      b: "Loyihalar",
      c: "Javob vaqti",
      d: "Yillik tajriba",
    },
    partners: {
      about: "Bizning Hamkorlarimiz",
      title: "Bizning Global Hamkorlar",
      subtitle: "Dunyoning eng yirik kompaniyalari bizga ishonadi",
    },
    testimonials: {
      about: "Mijozlarning fikirlari",
      title: "Mijozlarimizning Ajoyib Fikrlari",
      subtitle: "Har bir mijoz - bizning eng katta g'ururimiz",
    },
    cta: {
      ctaWork: "Biz Bilan Ishlash",
      a: "Boshlashga tayyormisiz?",

      title: "Loyihangiz bormi keling gaplashamiz!",
      subtitle: "Sizning g'oyangiz + bizning texnologiyamiz = ajoyib mahsulot",
      button: "Ha, Gaplashamiz!",
    },
    footer: {
      tagline: "Innovatsion IT Yechimlar",
      description: "Kelajakni bugun yaratamiz",
      services: "Xizmatlar",
      company: "Kompaniya",
      contact: "Aloqa",
      rights: "Barcha huquqlar himoyalangan.",
    },
  },
  ru: {
    nav: {
      about: "О нас",
      services: "Услуги",
      projects: "Проекты",
      team: "Команда",
      contact: "Контакты",
      a: "Сообщение отправлено!",
      b: "Мы свяжемся с вами в ближайшее время.",
    },
    hero: {
      title: "Создайте Будущее Сегодня",
      subtitle:
        "ArdentSoft - это компания инновационных IT-решений, которая переводит ваш бизнес в цифровое будущее. Мы реализуем каждый проект с совершенством.",
      button: "Начать Проект",
      viewProjects: "Посмотреть Проекты",
      features: {
        feature1: "24/7 Техподдержка",
        feature2: "AI-решения",
        feature3: "Команда Экспертов",
        feature4: "Быстрая Доставка",
      },
    },
    stats: {
      experience: "Лет Опыта",
      projects: "Успешных Проектов",
      clients: "Довольных Клиентов",
      specialists: "Технологических Экспертов",
    },
    about: {
      a: "Наши достижения",
      title: "Инновации в Нашей ДНК",
      description:
        "Мы - самая передовая IT-компания Узбекистана. Для каждого проекта мы применяем новейшие технологии, искусственный интеллект и облачные решения. Наша команда - это опытные архитекторы, full-stack разработчики, UI/UX дизайнеры и DevOps специалисты.",
    },
    values: {
      icon: "Наши сервисы",
      innovationLeaders: "Лидеры Инноваций",

      title: "Наши Суперсилы",
      subtitle: "В каждом проекте мы применяем наш уникальный подход",
      transparency: {
        title: "Кристальная Прозрачность",
        description: "Каждый процесс открыт и понятен. Отслеживание прогресса в реальном времени и полная отчетность.",
      },
      speed: {
        title: "Скорость Света",
        description: "Через Agile методологию и CI/CD pipeline доставляем проекты в рекордные сроки.",
      },
      innovation: {
        title: "Технологии Будущего",
        description: "Применяем новейшие технологии как AI, Machine Learning, Blockchain и IoT.",
      },
      engineering: {
        title: "Высокоточное проектирование",
        description: "Каждая строка кода, каждый пиксель идеален. Мы создаем только продукцию высочайшего качества."
      },
      solutions: {
        title: "Решения на основе искусственного интеллекта (ИИ)",
        description: "Решения, усиленные технологиями искусственного интеллекта и машинного обучения."
      },
      quality: {
        title: "Качество, достойное похвалы (Отмеченное наградами качество)",
        description: "Качество нашей работы соответствует международным стандартам и было удостоено многих наград."
      }
    },
    services: {
      title: "Наши Супер-Услуги",
      subtitle: "Каждая услуга - это мощный инструмент для вывода вашего бизнеса на новый уровень",
      "ai": {
        "title": "ИИ и Машинное Обучение",
        "description": "Мощные решения на основе искусственного интеллекта и технологий машинного обучения."
      },
      "cloud": {
        "title": "Облачная Архитектура",
        "description": "Масштабируемые и безопасные облачные решения на AWS, Azure и Google Cloud."
      },
      "mobile": {
        "title": "Мобильные Решения",
        "description": "Нативные и кроссплатформенные приложения на React Native и Flutter."
      },
      "web": {
        "title": "Веб-Инновации",
        "description": "Современные веб-приложения на Next.js, React и новейших технологиях."
      },
      "data": {
        "title": "Дата Инжиниринг",
        "description": "Решения для Big Data, аналитики и обработки данных в реальном времени."
      },
      "security": {
        "title": "Кибербезопасность",
        "description": "Защита данных и корпоративные решения по безопасности."
      }
    },
    projects: {
      about: "Наши Проекты",
      title: "Наши Проекты",
      subtitle: "Каждый проект - это образец инноваций и совершенства",
      viewAll: "Посмотреть Все Проекты",
      viewDetails: "Подробнее",
    },
    team: {
      about: "Наша Команда",
      title: "Наши Разработчики",
      subtitle: "Профессиональная и опытная команда разработчиков воплотит ваш проект в жизнь",
    },
    contact: {
      contact_us: "Связаться с нами",
      title: "Давайте Создадим Вместе",
      subtitle: "Ваша идея + наши технологии = потрясающий продукт. Начнем сегодня!",
      phone: "Телефон",
      email: "Email",
      address: "Адрес",
      form: {
        title: "Начать Проект",
        name: "Полное Имя",
        namePlaceholder: "Введите ваше имя",
        phoneLabel: "Номер Телефона",
        phonePlaceholder: "+998 90 123 45 67",
        message: "О Проекте",
        messagePlaceholder: "Расскажите подробно о вашем проекте...",
        submit: "Начать Проект",
      },
      texta: "Круглосуточная поддержка",
      textb: "Гарантия быстрого ответа",
      textc: "Посетите офис",
      btn: "Связаться",
      abc: "Ташкент, Узбекистан",
      why: "Почему выбрать нас?",
      fast: "Ответ в течение 24 часов",
      secur: "Безопасность данных",
      prof: "Профессиональная консультация",
      result: "Наши результаты",
      a: "Удовлетворенность клиентов",
      b: "Проекты",
      c: "Время ответа",
      d: "Годы опыта",
    },
    partners: {
      about: "Наши Партнеры",
      title: "Наши Глобальные Партнеры",
      subtitle: "Крупнейшие компании мира доверяют нам",
    },
    testimonials: {
      about: "Отзывы Клиентов",
      title: "Потрясающие Отзывы Клиентов",
      subtitle: "Каждый клиент - наша самая большая гордость",
    },
    cta: {
      ctaWork: "Работать с Нами",
      a: "Готовы начать?",

      title: "У вас есть проект? Давайте поговорим!",
      subtitle: "Ваша идея + наши технологии = потрясающий продукт",
      button: "Да, Поговорим!",
    },
    footer: {
      tagline: "Инновационные IT решения",
      description: "Создаем будущее сегодня",
      services: "Услуги",
      company: "Компания",
      contact: "Контакты",
      rights: "Все права защищены.",
    },
  },
  en: {
    nav: {
      about: "About Us",
      services: "Services",
      projects: "Projects",
      team: "Team",
      contact: "Contact",
      a: "Message sent!",
      b: "We will contact you shortly."
    },
    hero: {
      title: "Create The Future Today",
      subtitle:
        "ArdentSoft is an innovative IT solutions company that takes your business into the digital future. We execute every project with perfection.",
      button: "Start Project",
      viewProjects: "View Projects",
      features: {
        feature1: "24/7 Tech Support",
        feature2: "AI-powered Solutions",
        feature3: "Expert Team",
        feature4: "Rapid Delivery",
      },
    },
    stats: {
      experience: "Years of Experience",
      projects: "Successful Projects",
      clients: "Happy Clients",
      specialists: "Technology Experts",
    },
    about: {
      a: "Our Achievements",
      title: "Innovation is in Our DNA",
      description:
        "We are Uzbekistan's most advanced IT company. For each project, we apply the latest technologies, artificial intelligence, and cloud solutions. Our team consists of experienced architects, full-stack developers, UI/UX designers, and DevOps specialists.",
    },
    values: {
      icon: "Our Services",
      innovationLeaders: "Innovation Leaders",

      title: "Our Superpowers",
      subtitle: "In every project, we apply our unique approach",
      transparency: {
        title: "Crystal Transparency",
        description: "Every process is open and clear. Real-time progress tracking and complete reporting.",
      },
      speed: {
        title: "Speed of Light",
        description: "Through Agile methodology and CI/CD pipeline, we deliver projects in record time.",
      },
      innovation: {
        title: "Future Technologies",
        description: "We apply cutting-edge technologies like AI, Machine Learning, Blockchain, and IoT.",
      },
      engineering: {
        title: "High-Precision Engineering",
        description: "Every line of code, every pixel is perfect. We only create products of the highest quality."
      },
      solutions: {
        title: "AI-Powered Solutions (Artificial Intelligence)",
        description: "Solutions enhanced with Artificial Intelligence and machine learning technologies."
      },
      quality: {
        title: "Award-Winning Quality",
        description: "The quality of our work meets international standards and has received numerous awards."
      }
    },
    services: {
      title: "Our Super Services",
      subtitle: "Each service is a powerful tool to take your business to the next level",
      "ai": {
        "title": "AI & Machine Learning",
        "description": "Powerful solutions enhanced by artificial intelligence and machine learning technologies."
      },
      "cloud": {
        "title": "Cloud Architecture",
        "description": "Scalable and secure cloud solutions on AWS, Azure, and Google Cloud."
      },
      "mobile": {
        "title": "Mobile Excellence",
        "description": "Native and cross-platform mobile apps built with React Native and Flutter."
      },
      "web": {
        "title": "Web Innovation",
        "description": "Modern web applications powered by Next.js, React, and cutting-edge technologies."
      },
      "data": {
        "title": "Data Engineering",
        "description": "Big Data, analytics, and real-time processing solutions."
      },
      "security": {
        "title": "Cybersecurity",
        "description": "Enterprise-level security and data protection solutions."
      }
    },
    projects: {
      about: "Our Projects",
      title: "Our Projects",
      subtitle: "Every project is a showcase of innovation and perfection",
      viewAll: "View All Projects",
      viewDetails: "View details",
    },
    team: {
      about: "Our Team",
      title: "Our Developers",
      subtitle: "Professional and experienced team of developers will bring your project to life",
    },
    contact: {
      contact_us: "Contact us",
      title: "Let's Create Together",
      subtitle: "Your idea + our technology = amazing product. Let's start today!",
      phone: "Phone",
      email: "Email",
      address: "Address",
      form: {
        title: "Start Project",
        name: "Full Name",
        namePlaceholder: "Enter your name",
        phoneLabel: "Phone Number",
        phonePlaceholder: "+998 90 123 45 67",
        message: "About Project",
        messagePlaceholder: "Tell us about your project in detail...",
        submit: "Start Project",
      },
      texta: "24/7 Support",
      textb: "Guaranteed quick response",
      textc: "Visit the office",
      btn: "Connect",
      abc: "Tashkent, Uzbekistan",
      why: "Why choose us?",
      fast: "Response within 24 hours",
      secur: "Data security",
      prof: "Professional consultation",
      result: "Our Results",
      a: "Customer satisfaction",
      b: "Projects",
      c: "Response time",
      d: "Years of experience",
    },
    partners: {
      about: "Trusted Partners",
      title: "Our Global Partners",
      subtitle: "World's largest companies trust us",
    },
    testimonials: {
      about: "Client Reviews",
      title: "Amazing Client Reviews",
      subtitle: "Every client is our greatest pride",
    },
    cta: {
      ctaWork: "Work With Us",
      a: "Ready to Start?",

      title: "Have a project? Let's talk!",
      subtitle: "Your idea + our technology = amazing product",
      button: "Yes, Let's Talk!",
    },
    footer: {
      tagline: "Innovation IT Solutions",
      description: "Creating the future today",
      services: "Services",
      company: "Company",
      contact: "Contact",
      rights: "All rights reserved.",
    },
  },
}

export default function HomePage() {
  const [language, setLanguage] = useState("uz")
  const [mounted, setMounted] = useState(false)

  const t = translations[language as keyof typeof translations]

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const values = [
    {
      icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.values.transparency.title,
      description: t.values.transparency.description,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.values.speed.title,
      description: t.values.speed.description,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Rocket className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.values.innovation.title,
      description: t.values.innovation.description,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Target className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.values.engineering.title,
      description: t.values.engineering.description,
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.values.solutions.title,
      description: t.values.solutions.description,
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.values.quality.title,
      description: t.values.quality.description,
      gradient: "from-red-500 to-pink-500",
    },
  ]

  const services = [
    {
      icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.services.ai.title,
      description: t.services.ai.description,
      gradient: "from-purple-600 to-indigo-600",
      features: ["Neural Networks", "Deep Learning", "Computer Vision", "NLP"],
    },
    {
      icon: <Cloud className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.services.cloud.title,
      description: t.services.cloud.description,
      gradient: "from-blue-600 to-cyan-600",
      features: ["Microservices", "Kubernetes", "Serverless", "DevOps"],
    },
    {
      icon: <Smartphone className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.services.mobile.title,
      description: t.services.mobile.description,
      gradient: "from-green-600 to-teal-600",
      features: ["iOS & Android", "React Native", "Flutter", "PWA"],
    },
    {
      icon: <Monitor className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.services.web.title,
      description: t.services.web.description,
      gradient: "from-orange-600 to-red-600",
      features: ["Next.js", "React", "TypeScript", "GraphQL"],
    },
    {
      icon: <Database className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.services.data.title,
      description: t.services.data.description,
      gradient: "from-indigo-600 to-purple-600",
      features: ["Big Data", "Analytics", "Real-time", "ETL"],
    },
    {
      icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.services.security.title,
      description: t.services.security.description,
      gradient: "from-red-600 to-pink-600",
      features: ["Penetration Testing", "Security Audit", "Compliance", "Monitoring"],
    },
  ]

  if (!mounted) {
    return null
  }

  return (
    <MaintenanceWrapper>
      <div className="min-h-screen bg-white">
        {/* Innovative Navbar */}
        <InnovativeNavbar
          language={language}
          setLanguage={setLanguage}
          scrollToContact={scrollToContact}
          translations={translations}
        />

        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/ardent-services-hero.png"
              alt="Ardent Services"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/80 to-pink-900/70"></div>
          </div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 md:p-16 lg:p-20 border border-white/10 shadow-2xl">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 mb-8">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">{t.footer.tagline}</span>

              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  {t.hero.title}
                </span>
              </h1>

              <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
                {t.hero.subtitle}
              </p>

              {/* Hero Features */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                {[
                  { icon: <Shield className="w-6 h-6" />, text: t.hero.features.feature1 },
                  { icon: <Brain className="w-6 h-6" />, text: t.hero.features.feature2 },
                  { icon: <Users className="w-6 h-6" />, text: t.hero.features.feature3 },
                  { icon: <Zap className="w-6 h-6" />, text: t.hero.features.feature4 },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
                  >
                    <div className="text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <p className="text-white text-sm sm:text-base font-medium">{feature.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <Button
                  onClick={scrollToContact}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  {t.hero.button}
                  <Rocket className="w-6 h-6 ml-3" />
                </Button>

                <Link href="/projects">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold rounded-2xl transition-all duration-300"
                  >
                    {t.hero.viewProjects}
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 sm:py-28 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fillOpacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-4">
                {t.about.a}
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { number: "5", suffix: "+", label: t.stats.experience, color: "from-blue-600 to-purple-600" },
                { number: "50", suffix: "+", label: t.stats.projects, color: "from-green-600 to-teal-600" },
                { number: "30", suffix: "+", label: t.stats.clients, color: "from-orange-600 to-red-600" },
                { number: "15", suffix: "+", label: t.stats.specialists, color: "from-purple-600 to-pink-600" },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 bg-white/80 backdrop-blur-sm"
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className={`text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {stat.number + stat.suffix}
                    </div>
                    <p className="text-gray-700 font-bold text-sm sm:text-base lg:text-lg">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 sm:py-28 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="relative group">
                  <Image
                    src="/images/ardent-hero-new.png"
                    alt="ArdentSoft Innovation"
                    width={600}
                    height={400}
                    className="rounded-3xl shadow-2xl w-full h-auto group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:opacity-0 transition-opacity duration-500"></div>

                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500">
                    <Brain className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:-rotate-12 transition-transform duration-500">
                    <Rocket className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-600 font-semibold">{t.values.innovationLeaders}</span>
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-8 leading-tight">
                  {t.about.title}
                </h2>

                <p className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed">{t.about.description}</p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={scrollToContact}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {t.cta.ctaWork}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <Link href="/projects">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 bg-transparent"
                    >
                      {t.projects.viewAll}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 sm:py-28 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 mb-6">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-semibold">{t.values.title}</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
                {t.values.title}
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">{t.values.subtitle}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 bg-white/80 backdrop-blur-sm overflow-hidden"
                >
                  <CardContent className="p-8 relative">
                    <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${value.gradient}`}></div>

                    <div
                      className={`w-20 h-20 bg-gradient-to-r ${value.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                    >
                      {value.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-blue-600 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
                <Code className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-semibold">{t.values.icon}</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
                {t.services.title}
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">{t.services.subtitle}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 bg-white overflow-hidden"
                >
                  <CardContent className="p-8 relative">
                    <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${service.gradient}`}></div>

                    <div
                      className={`w-20 h-20 bg-gradient-to-r ${service.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                    >
                      {service.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed mb-6">{service.description}</p>

                    {/* Service Features */}
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 text-center"
                        >
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 sm:py-28 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <div className="text-center mb-16 px-4">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 mb-6">
              <Building className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-semibold">{t.projects.about}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
              {t.projects.title}
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto mb-8">{t.projects.subtitle}</p>
          </div>

          {/* Project Carousel */}
          <ProjectCarousel language={language} translations={translations} />


          <div className="text-center mt-12 px-4">
            <Link href="/projects">
              <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                {t.projects.viewAll} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-20 sm:py-28 bg-white group">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-semibold">{t.team.about}</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
                {t.team.title}
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto">{t.team.subtitle}</p>
            </div>

            <TeamCarousel />
          </div>
        </section>

        {/* Partners Section
        <section className="py-20 sm:py-28 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 mb-6">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-semibold">{t.partners.about}</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
                {t.partners.title}
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto">{t.partners.subtitle}</p>
            </div>

            <PartnersCarousel />
          </div>
        </section>

        {/* Testimonials Section 
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
                <Star className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-semibold">{t.testimonials.about}</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
                {t.testimonials.title}
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto">{t.testimonials.subtitle}</p>
            </div>

            <TestimonialsCarousel />
          </div>
        </section>
        */}

        {/* Innovative Contact Section */}
        <InnovativeContact translations={translations} language={language} />

        {/* CTA Section */}
        <section className="py-20 sm:py-28 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-8">
              <Rocket className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">{t.cta.a}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-8">{t.cta.title}</h2>
            <p className="text-xl sm:text-2xl text-white/90 mb-12">{t.cta.subtitle}</p>

            <Button
              onClick={scrollToContact}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-xl font-black rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl shadow-xl"
            >
              {t.cta.button}
              <Sparkles className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <Image
                  src="/images/ardent-logo.png"
                  alt="ARDENT SOFT"
                  width={180}
                  height={40}
                  className="h-12 w-auto mb-6 brightness-0 invert"
                />
                <p className="text-gray-400 text-lg leading-relaxed mb-6">{t.footer.description}</p>

                {/* Social Links */}
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                    <span className="text-white font-bold">f</span>
                  </div>
                  <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                    <span className="text-white font-bold">t</span>
                  </div>
                  <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer">
                    <span className="text-white font-bold">in</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-6 text-white">{t.footer.services}</h4>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-white transition-colors cursor-pointer">AI & Machine Learning</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Cloud Architecture</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Mobile Development</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Web Innovation</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-6 text-white">{t.footer.company}</h4>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-white transition-colors cursor-pointer">{t.nav.about}</li>
                  <li className="hover:text-white transition-colors cursor-pointer">{t.nav.projects}</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Career</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-6 text-white">{t.footer.contact}</h4>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-white transition-colors">+998 90 123 45 67</li>
                  <li className="hover:text-white transition-colors">info@ardentsoft.uz</li>
                  <li className="hover:text-white transition-colors">Toshkent, O'zbekiston</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center">
              <p className="text-gray-400 text-lg">&copy; 2024 ArdentSoft. {t.footer.rights}</p>
            </div>
          </div>
        </footer>
      </div>
    </MaintenanceWrapper>
  )
}
