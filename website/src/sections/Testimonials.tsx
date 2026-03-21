import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    avatar: 'S',
    text: 'JournalAI completely changed how I learn. The AI summaries save me so much time and the quizzes actually help me retain what I write about.'
  },
  {
    name: 'Marcus Williams',
    role: 'CS Student',
    avatar: 'M',
    text: 'I love how it suggests what to learn next based on my entries. It feels like having a personal mentor who knows exactly where I am in my journey.'
  },
  {
    name: 'Priya Patel',
    role: 'Product Manager',
    avatar: 'P',
    text: 'The mood tracking feature is surprisingly accurate. I can now see patterns in my productivity and how my emotions affect my learning.'
  },
  {
    name: 'Alex Rivera',
    role: 'Self-taught Developer',
    avatar: 'A',
    text: 'Chat with Journal is insane. I asked it to summarize everything I learned about React in the past month and it gave me a perfect breakdown.'
  },
  {
    name: 'Jamie Lee',
    role: 'UX Designer',
    avatar: 'J',
    text: 'The editor is so clean and distraction free. Auto-save means I never lose my thoughts. Best journaling app I have ever used.'
  },
  {
    name: 'David Kim',
    role: 'Entrepreneur',
    avatar: 'D',
    text: 'Free and this powerful? I was skeptical but JournalAI delivers. The progress analytics alone are worth it.'
  },
]

const Testimonials = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs text-accent uppercase tracking-widest mb-4">Testimonials</p>
          <h2 className="text-4xl md:text-5xl text-text mb-4">
            Loved by learners
            <br />
            <span className="text-accent italic">around the world</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Join thousands of people who use JournalAI to supercharge their learning.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-accent/20 transition-colors"
            >
              <Quote size={20} className="text-accent/40" />
              <p className="text-sm text-muted leading-relaxed flex-1">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-sm flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm text-text font-medium">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Testimonials