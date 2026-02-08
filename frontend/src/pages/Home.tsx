import { Loader2Icon } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import api from '@/configs/axios'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Home = () => {
      const { data: session } = authClient.useSession();
      const [input, setInput] = useState("")
      const [loading, setLoading] = useState(false)
      const navigate = useNavigate();

      const onSubmitHandler = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);

            try {
                  if (!session?.user) {
                        setLoading(false);
                        return toast.error('Please sign in to create a project')
                  } else if (!input.trim()) {
                        setLoading(false);
                        return toast.error('Please provide a valid prompt')
                  }
                  const { data } = await api.post('api/user/project', { initial_prompt: input });
                  setLoading(false);

                  navigate(`/projects/${data.projectId}`)

            } catch (error: any) {
                  setLoading(false);
                  toast.error(error?.response?.data?.message || 'Failed to create project');
                  console.log(error);
            }
      }

      // Animation variants
      const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                  opacity: 1,
                  transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2
                  }
            }
      };

      const itemVariants = {
            hidden: { y: 20, opacity: 0 },
            visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                        duration: 0.5,
                        ease: [0.25, 0.4, 0.25, 1]
                  }
            }
      };

      return (
            <>
                  <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                  >
                        <Navbar />
                  </motion.div>

                  <motion.section
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins"
                  >
                        {/* BACKGROUND IMAGE */}
                        <motion.img
                              initial={{ scale: 1.1, opacity: 0 }}
                              animate={{ scale: 1, opacity: 0.45 }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                              src="https://images.unsplash.com/photo-1712397943847-e104395a1a8b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                              className="fixed inset-0 -z-10 w-full h-full object-cover"
                              alt=""
                        />

                        <motion.a
                              variants={itemVariants}
                              className="flex items-center gap-2 border border-slate-700 rounded-full p-1 pr-3 text-sm mt-20"
                              href='/pricing'
                        >
                              <span className="bg-indigo-600 text-xs px-3 py-1 rounded-full">NEW HERE</span>
                              <p className="flex items-center gap-2">
                                    <span>Take trial with our pricing option</span>
                                    <svg className="mt-px" width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="m1 1 4 3.5L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                              </p>
                        </motion.a>

                        <motion.h1
                              variants={itemVariants}
                              className="text-center text-[40px] leading-[48px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-3xl"
                        >
                              Turn thoughts into websites instantly, with AI.
                        </motion.h1>

                        <motion.p
                              variants={itemVariants}
                              className="text-center text-base max-w-md mt-2"
                        >
                              Create, customize and present faster than ever with intelligent design powered by AI.
                        </motion.p>

                        <motion.form
                              variants={itemVariants}
                              onSubmit={onSubmitHandler}
                              className="bg-white/10 max-w-2xl w-full rounded-xl p-4 mt-10 border border-blue-400/70 focus-within:ring-2 ring-indigo-500 transition-all"
                        >
                              <textarea
                                    onChange={e => setInput(e.target.value)}
                                    value={input}
                                    className="bg-transparent outline-none text-gray-300 resize-none w-full"
                                    rows={4}
                                    placeholder="Describe your presentation in details"
                                    required
                              />

                              <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                    className="group relative ml-auto flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full text-white font-medium transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-80 disabled:cursor-not-allowed"
                              >
                                    {loading ? (
                                          <div className="flex items-center gap-2">
                                                <span>Creating</span>
                                                <Loader2Icon className="animate-spin size-4 text-white" />
                                          </div>
                                    ) : (
                                          <div className="relative h-6 overflow-hidden">
                                                <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                                                      Create with AI
                                                </span>
                                                <span className="absolute top-full left-1/2 -translate-x-1/2 w-full text-center block transition-transform duration-300 group-hover:-translate-y-full">
                                                      Create with AI
                                                </span>
                                          </div>
                                    )}
                              </motion.button>
                        </motion.form>
                  </motion.section>
            </>
      )
}

export default Home