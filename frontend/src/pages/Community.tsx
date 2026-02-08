import React, { useEffect } from 'react'
import type { Project } from '../types';
import { Loader2Icon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import api from '@/configs/axios';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const Community = () => {
  const [loading, setLoading] = React.useState(true);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const { data } = await api.get(`/api/project/published`);
      setProjects(data.projects);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      toast.error(error?.response?.data?.message || "Failed to fetch projects");
    }
  }

  useEffect(() => {
    fetchProjects();
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  };

  return (
    <PageTransition>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Navbar />
      </motion.div>

      {/* BACKGROUND IMAGE */}
      <motion.img
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.45 }}
        transition={{ duration: 0.8 }}
        src="https://images.unsplash.com/photo-1712397943847-e104395a1a8b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className="fixed inset-0 -z-10 w-full h-full object-cover"
        alt=""
      />

      <div className='px-4 md:px-16 lg:px-24 xl:px-32'>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='flex items-center justify-center h-[80vh]'
          >
            <Loader2Icon className='size-7 animate-spin text-indigo-200' />
          </motion.div>
        ) : projects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='py-10 min-h-[80vh]'
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className='flex items-center justify-between mb-12'
            >
              <h1 className='text-2xl font-medium text-white'>Published Projects</h1>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className='flex flex-wrap gap-3.5'
            >
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={`/view/${project.id}`}
                    target='_blank'
                    className='block w-72 max-sm:mx-auto cursor-pointer bg-gray-900/60 border border-gray-700 rounded-lg overflow-hidden group hover:border-indigo-800/80 transition-all duration-300'
                  >
                    {/* Desktop Preview */}
                    <div className='relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800'>
                      {project.current_code ? (
                        <iframe
                          srcDoc={project.current_code}
                          className='absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left pointer-events-none'
                          sandbox='allow-scripts allow-same-origin'
                          style={{ transform: "scale(0.25)" }}
                        />
                      ) : (
                        <div className='flex items-center justify-center h-full text-gray-500'>
                          <p>No Preview</p>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className='p-4 text-white bg-gradient-to-b from-transparent group-hover:from-indigo-950 to-transparent transition-colors'>
                      <div className='flex items-start justify-between'>
                        <h2 className='text-lg font-medium line-clamp-2'>
                          {project.name}
                        </h2>
                        <button className='px-2.5 py-0.5 mt-1 ml-2 text-xs bg-indigo-600 border border-gray-700 rounded-full'>
                          Website
                        </button>
                      </div>

                      <p className='text-gray-400 mt-1 text-sm line-clamp-2'>{project.initial_prompt}</p>

                      <div className='flex justify-between items-center mt-6'>
                        <span className='text-xs text-gray-500'>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        <div className='flex gap-3 text-white text-sm items-bottom'>
                          <button className='px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md transition-colors flex items-center gap-2'>
                            <span className='bg-gray-200 size-4.5 rounded-full text-black font-semibold flex items-center justify-center'>
                              {project.user?.name?.slice(0, 1)}
                            </span>
                            {project.user?.name}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='flex flex-col items-center justify-center h-[80vh]'
          >
            <h1 className='text-4xl font-semibold text-white mb-4'>No Projects Found!</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { navigate('/') }}
              className='text-white px-5 py-2 mt-5 rounded-md bg-indigo-500 hover:bg-indigo-600 transition-all'
            >
              Create New
            </motion.button>
          </motion.div>
        )}
      </div>
      <Footer />
    </PageTransition>
  )
}

export default Community