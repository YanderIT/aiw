'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText,
  Edit3,
  Sparkles,
  Link,
  BarChart3,
  Grid3X3
} from 'lucide-react';

function FlowDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const flowSteps = [
    {
      id: 1,
      label: '新建文书',
      description: '开始创建您的申请文书',
      image: '/imgs/30222.avif',
      alt: '新建文书界面预览'
    },
    {
      id: 2,
      label: '填写信息',
      description: '输入基本信息（姓名、专业、目标院校）',
      image: '/imgs/bento_32.avif',
      alt: '填写信息界面预览'
    },
    {
      id: 3,
      label: '生成文书',
      description: 'AI 智能生成个性化文书',
      image: '/imgs/bento_1.avif',
      alt: 'AI生成文书界面预览'
    },
    {
      id: 4,
      label: '生成中',
      description: '正在为您生成专属文书...',
      image: '/imgs/bento_4.avif',
      alt: '生成中界面预览'
    },
    {
      id: 5,
      label: '预览文书',
      description: '查看生成的完整文书',
      image: '/imgs/bento_5.avif',
      alt: '预览文书界面'
    },
    {
      id: 6,
      label: '修改导出',
      description: '编辑优化或直接导出',
      image: '/imgs/bento_32.avif',
      alt: '导出文书界面'
    },
  ];
  
  useEffect(() => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      
      intervalRef.current = setTimeout(() => {
        setActiveStep((prev) => (prev + 1) % flowSteps.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [activeStep, isPlaying, flowSteps.length]);
  
  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setIsPlaying(false);
    
    setTimeout(() => {
      setIsPlaying(true);
    }, 8000);
  };

  const currentStep = flowSteps[activeStep];

  return (
    <>
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0); }
        }
        @keyframes gradient-xy {
          0%, 100% { transform: translateX(0%) translateY(0%); }
          25% { transform: translateX(-5%) translateY(-5%); }
          50% { transform: translateX(5%) translateY(-5%); }
          75% { transform: translateX(-5%) translateY(5%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes stardust {
          0% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
          100% { opacity: 0; transform: scale(0) rotate(360deg); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 15s ease infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        .animate-stardust {
          animation: stardust 4s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      <div className="py-24 relative overflow-hidden">
        <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-lg font-semibold text-primary">使用流程</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            简单几步，轻松搞定申请文书
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            智能引导式创作流程，让文书写作变得简单高效
          </p>
        </div>

        <div className="max-w-10xl mx-auto">
          <div className="relative">
            {/* Sparkle Effects */}
            <div className="absolute -inset-1">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
              <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>
            
            {/* Main Content Area with Apple-style Design */}
            <div className="relative">
              {/* Enhanced shadow layers with gradient colors */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#86f096]/30 via-[#5dde88]/30 to-[#3dcd77]/30 rounded-[32px] blur-3xl opacity-80 animate-pulse-glow" />
              <div className="absolute -inset-2 bg-gradient-to-br from-[#86f096]/20 to-[#3dcd77]/20 rounded-[30px] blur-2xl" />
              
              {/* Stardust effects around the edges */}
              <div className="absolute -inset-3 pointer-events-none">
                {/* Top edge stardust */}
                <div className="absolute top-0 left-1/4 w-2 h-2 bg-white/60 rounded-full animate-stardust" />
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-stardust animation-delay-1000" />
                <div className="absolute top-0 left-3/4 w-2 h-2 bg-purple-400/60 rounded-full animate-stardust animation-delay-2000" />
                
                {/* Right edge stardust */}
                <div className="absolute top-1/4 right-0 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-stardust animation-delay-3000" />
                <div className="absolute top-1/2 right-0 w-2 h-2 bg-white/60 rounded-full animate-stardust animation-delay-4000" />
                <div className="absolute top-3/4 right-0 w-1.5 h-1.5 bg-yellow-400/60 rounded-full animate-stardust" />
                
                {/* Bottom edge stardust */}
                <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-stardust animation-delay-2000" />
                <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-white/60 rounded-full animate-stardust animation-delay-3000" />
                <div className="absolute bottom-0 left-3/4 w-2 h-2 bg-purple-400/60 rounded-full animate-stardust animation-delay-1000" />
                
                {/* Left edge stardust */}
                <div className="absolute top-1/4 left-0 w-1.5 h-1.5 bg-yellow-400/60 rounded-full animate-stardust animation-delay-4000" />
                <div className="absolute top-1/2 left-0 w-2 h-2 bg-pink-400/60 rounded-full animate-stardust animation-delay-2000" />
                <div className="absolute top-3/4 left-0 w-1.5 h-1.5 bg-white/60 rounded-full animate-stardust animation-delay-1000" />
              </div>
              
              {/* Shimmer effect layer */}
              <div className="absolute -inset-px rounded-[26px] overflow-hidden pointer-events-none">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>
              
              {/* Main container without black border */}
              <div className="relative rounded-[26px] overflow-hidden bg-gradient-to-br from-gray-800/80 via-gray-800/85 to-gray-900/80 backdrop-blur-xl shadow-[0_25px_80px_-10px_rgba(134,240,150,0.3)]">
                {/* Top reflection for depth */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                
                {/* Content container */}
                <div className="relative h-[75vh] 2xl:h-[35vh]">
                  {/* Inner sparkle particles */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="sparkle-1 absolute w-1 h-1 bg-white rounded-full animate-sparkle" style={{ top: '10%', left: '20%' }} />
                    <div className="sparkle-2 absolute w-1 h-1 bg-blue-400 rounded-full animate-sparkle animation-delay-1000" style={{ top: '60%', left: '80%' }} />
                    <div className="sparkle-3 absolute w-1 h-1 bg-purple-400 rounded-full animate-sparkle animation-delay-2000" style={{ top: '30%', left: '50%' }} />
                    <div className="sparkle-4 absolute w-1 h-1 bg-pink-400 rounded-full animate-sparkle animation-delay-3000" style={{ top: '70%', left: '10%' }} />
                    <div className="sparkle-5 absolute w-1 h-1 bg-yellow-400 rounded-full animate-sparkle animation-delay-4000" style={{ top: '40%', left: '90%' }} />
                  </div>
                  
                  {/* Full Image Display */}
                  <div className="absolute inset-0">
                    <img 
                      src={currentStep.image} 
                      alt={currentStep.alt}
                      className="w-full h-full object-cover"
                    />
                    {/* Subtle vignette effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                
 
              
                {/* Bottom Action Bar with Apple-style Glassmorphism */}
                <div className="absolute bottom-0 left-0 right-0 z-20">
                  <div className="flex justify-center mb-8">
                    {/* Glassmorphic Container with Apple-style refinements */}
                    <div className="relative group">
                      {/* Subtle outer glow */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600/20 to-gray-400/20 rounded-[22px] blur opacity-75 group-hover:opacity-100 transition duration-300" />
                      
                      {/* Main container */}
                      <div className="relative bg-black/40 backdrop-blur-2xl rounded-[20px] border border-white/10 overflow-visible">
                        {/* Inner light reflection */}
                        <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                        
                        {/* Button container with proper alignment */}
                        <div className="relative flex items-end gap-1 px-3 pb-2 pt-6" style={{ height: '76px' }}>
                          {[
                            { icon: FileText, step: 0 },
                            { icon: Edit3, step: 1 },
                            { icon: Sparkles, step: 2 },
                            { icon: Link, step: 3 },
                            { icon: BarChart3, step: 4 },
                            { icon: Grid3X3, step: 5 }
                          ].map(({ icon: Icon, step }) => (
                            <div
                              key={step}
                              className={`
                                relative transition-all duration-500
                                ${activeStep === step 
                                  ? 'z-20' 
                                  : 'z-10'
                                }
                              `}
                              style={{
                                alignSelf: 'flex-end',
                              }}
                            >
                              <button
                                onClick={() => handleStepClick(step)}
                                className="relative group/btn block"
                              >
                                {/* Button wrapper that grows upward */}
                                <div className={`
                                  relative transition-all duration-500 origin-bottom
                                  ${activeStep === step ? '-mt-10' : 'mt-0'}
                                `}>
                                  {/* Label above active button */}
                                  {activeStep === step && (
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all duration-300">
                                      {flowSteps[step].label}
                                    </div>
                                  )}
                                  
                                  {/* Button background */}
                                  <div className={`
                                    relative overflow-hidden transition-all duration-300
                                    ${activeStep === step 
                                      ? 'bg-gray-800/90 shadow-2xl rounded-[28px] ring-[2px] ring-inset ring-white/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]' 
                                      : 'bg-white/5 hover:bg-white/10 rounded-[14px] ring-[2px] ring-inset ring-white/15'
                                    }
                                  `}>
                                    {/* Active state - outer black spread */}
                                    {activeStep === step && (
                                      <>
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                        
                                        {/* Subtle inner shadow - white gradient from top */}
                                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 via-white/10 to-transparent" />
                                      </>
                                    )}
                                    
                                    {/* Inner content */}
                                    <div className={`
                                      relative transition-all duration-300
                                      ${activeStep === step 
                                        ? 'px-6 pt-8 pb-4' 
                                        : 'px-5 py-5 group-hover/btn:py-[18px]'
                                      }
                                    `}>
                                  {/* Top highlight for depth */}
                                  {activeStep === step ? (
                                    <>
                                      {/* Strong white top glow spreading downward */}
                                      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/30 via-white/10 to-transparent blur-sm" />
                                      <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                                    </>
                                  ) : (
                                    <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                  )}
                                  
                                  {/* Icon */}
                                  <div className="flex items-center justify-center">
                                    <Icon className={`
                                      relative z-10 transition-all duration-300
                                      ${activeStep === step 
                                        ? 'w-7 h-7 text-white transform -translate-y-1' 
                                        : 'w-6 h-6 text-gray-400 group-hover/btn:text-white'
                                      }
                                    `} />
                                  </div>
                                  
                                      {/* Active indicator dot */}
                                      {activeStep === step && (
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/80 rounded-full" />
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Subtle shadow for active button */}
                                  {activeStep === step && (
                                    <div className="absolute inset-0 -z-10 rounded-[28px] bg-white/20 blur-xl" />
                                  )}
                                </div>
                              </button>
                            </div>
                          ))}
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
            {/* Step Description - Outside the box */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-lg transition-all duration-300">
                {currentStep.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default FlowDemo;