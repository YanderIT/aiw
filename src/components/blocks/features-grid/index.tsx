'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  FileText, 
  User, 
  Mail, 
  UserCheck, 
  RefreshCw, 
  Users,
  ArrowUpRight,
  X,
  Zap
} from 'lucide-react'

interface Feature {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  hasDirectAccess: boolean
  link?: string
  bgColor: string
  iconColor: string
  image?: string
}

interface FeaturesSection {
  sectionTitle: string
  sectionSubtitle: string
  personalStatement: { title: string; description: string }
  resume: { title: string; description: string }
  coverLetterSop: { title: string; description: string }
  nativeTeacher: { title: string; description: string }
  freeRevision: { title: string; description: string }
  aiHumanPolish: { title: string; description: string }
  startNow: string
}

export default function FeaturesGrid({ section }: { section?: FeaturesSection }) {
  const router = useRouter()
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)

  const features: Feature[] = [
    {
      id: 'personal-statement',
      icon: <FileText className="w-8 h-8" />,
      title: section?.personalStatement?.title || '个人陈述（PS）生成',
      description: section?.personalStatement?.description || '从构思到定稿，全程AI辅助，打造展示你独特优势的个人陈述。',
      hasDirectAccess: true,
      link: '/personal-statement',
      bgColor: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      image: '/imgs/bento_1.avif'
    },
    {
      id: 'resume',
      icon: <User className="w-8 h-8" />,
      title: section?.resume?.title || '简历（CV）生成',
      description: section?.resume?.description || '根据目标岗位和学校，智能调整简历内容和格式。',
      hasDirectAccess: true,
      link: '/resume-generator',
      bgColor: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-600',
      image: '/imgs/30222.avif'
    },
    {
      id: 'cover-letter-sop',
      icon: <Mail className="w-8 h-8" />,
      title: section?.coverLetterSop?.title || '求职信/动机信（CL/SOP）生成',
      description: section?.coverLetterSop?.description || '专业的求职信和动机信生成器，帮你清晰表达申请动机。',
      hasDirectAccess: true,
      link: '/cover-letter',
      bgColor: 'from-green-50 to-green-100',
      iconColor: 'text-green-600',
      image: '/imgs/bento_4.avif'
    },
    {
      id: 'native-teacher',
      icon: <UserCheck className="w-8 h-8" />,
      title: section?.nativeTeacher?.title || '常驻英语母语老师修改',
      description: section?.nativeTeacher?.description || '经验丰富的英语母语教师提供专业润色。',
      hasDirectAccess: true,
      link: '/native-teacher-review',
      bgColor: 'from-orange-50 to-orange-100',
      iconColor: 'text-orange-600',
      image: '/imgs/bento_32.avif'
    },
    {
      id: 'free-revision',
      icon: <RefreshCw className="w-8 h-8" />,
      title: section?.freeRevision?.title || '每份文书可免费修改润色一次',
      description: section?.freeRevision?.description || '我们承诺每份文书都可享受一次免费修改服务。',
      hasDirectAccess: false,
      bgColor: 'from-pink-50 to-pink-100',
      iconColor: 'text-pink-600',
      image: '/imgs/bento_5.avif'
    },
    {
      id: 'ai-human-polish',
      icon: <Users className="w-8 h-8" />,
      title: section?.aiHumanPolish?.title || 'AI + 人工双重润色',
      description: section?.aiHumanPolish?.description || '结合AI智能分析和专业人工审核，双重保障文书质量。',
      hasDirectAccess: false,
      bgColor: 'from-indigo-50 to-indigo-100',
      iconColor: 'text-indigo-600',
      image: '/imgs/30222.avif'
    }
  ]

  const handleCardClick = (feature: Feature) => {
    setSelectedFeature(feature)
  }

  const handleModalClose = () => {
    setSelectedFeature(null)
  }

  const handleNavigate = (link: string) => {
    router.push(link)
    setSelectedFeature(null)
  }

  return (
    <>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with badge */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-lg font-semibold text-primary">核心功能</span>
            </motion.div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              {section?.sectionTitle || '为你留学之路量身打造的核心功能'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {section?.sectionSubtitle || '我们提供的不止是写作，更是通往梦校的钥匙。'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="relative"
              >
                <motion.div
                  onClick={() => handleCardClick(feature)}
                  className={`
                    relative rounded-2xl cursor-pointer overflow-hidden
                    bg-gradient-to-br ${feature.bgColor}
                    border border-gray-100
                    transition-all duration-300
                    hover:shadow-xl hover:border-gray-200
                    group
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Image Section */}
                  {feature.image && (
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}
                  
                  {/* Content Section */}
                  <div className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-base leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      {feature.hasDirectAccess && (
                        <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Detail Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleModalClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${selectedFeature.bgColor} border border-gray-200 shadow-2xl`}>
                {/* Modal Image */}
                {selectedFeature.image && (
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={selectedFeature.image}
                      alt={selectedFeature.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                )}
                
                <div className="p-8">
                  <button
                    onClick={handleModalClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedFeature.title}
                  </h3>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {selectedFeature.description}
                  </p>

                  {selectedFeature.hasDirectAccess && selectedFeature.link && (
                    <button
                      onClick={() => handleNavigate(selectedFeature.link!)}
                      className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      {section?.startNow || '立即开始'}
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  )}

                  {selectedFeature.hasDirectAccess && (
                    <div className="absolute bottom-6 right-6">
                      <div className="p-2 rounded-full bg-white/80 backdrop-blur-sm">
                        <ArrowUpRight className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}