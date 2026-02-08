import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import type { Project } from '../types';
import { ArrowBigDownDash, Eye, EyeOff, Maximize, Home, Laptop, Loader2, MessageSquare, Save, Smartphone, Tablet, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ProjectPreview, { type ProjectPreviewRef } from '../components/ProjectPreview';
import api from '@/configs/axios';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const Projects = () => {
  const { projectId } = useParams()
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isGenerating, setIsGenerating] = useState<boolean>(true)
  const [device, setDevice] = useState<'desktop' | 'mobile' | 'tablet'>('desktop')
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const projectPreviewRef = useRef<ProjectPreviewRef>(null);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/api/user/project/${projectId}`)
      setProject(data.project)
      setIsGenerating(data.project.current_code ? false : true)
      setLoading(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load project')
      console.error(error)
    }
  }

  const saveProject = async () => {
    if (!projectPreviewRef.current) return;
    const code = projectPreviewRef.current.getCode();
    if (!code) return;
    setIsSaving(true);
    try {
      const { data } = await api.put(`/api/project/save/${projectId}`, { code })
      toast.success('Project saved successfully')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save project')
      console.log(error)
    } finally {
      setIsSaving(false);
    }
  }

  const downloadCode = async () => {
    const code = projectPreviewRef.current?.getCode() || project?.current_code;
    if (!code) {
      if (isGenerating) {
        return
      }
    }

    const element = document.createElement("a");
    const file = new Blob([code || ''], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `index.html`;
    document.body.appendChild(element);
    element.click();
  }

  const togglePublish = async () => {
    try {
      const { data } = await api.get(`/api/user/publish-toggle/${projectId}`)
      toast.success('Project published successfully')
      setProject((prev) => prev ? ({ ...prev, isPublished: !prev.isPublished }) : null)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to publish project')
      console.log(error)
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    if (session?.user) {
      fetchProject();
    } else if (!isPending && !session?.user) {
      navigate('/')
      toast("Please login to access the project")
    }
  }, [session?.user])

  useEffect(() => {
    if (project && !project.current_code) {
      const IntervalId = setInterval(fetchProject, 10000)
      return () => clearInterval(IntervalId);
    }
  }, [project])

  if (loading) {
    return (
      <>
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.45 }}
          transition={{ duration: 0.8 }}
          src="https://images.unsplash.com/photo-1712397943847-e104395a1a8b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="fixed inset-0 -z-10 w-full h-full object-cover"
          alt=""
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex items-center justify-center h-screen'
        >
          <Loader2 className="animate-spin text-white" />
        </motion.div>
      </>
    )
  }

  return project ? (
    <PageTransition>
      <motion.img
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.45 }}
        transition={{ duration: 0.8 }}
        src="https://images.unsplash.com/photo-1712397943847-e104395a1a8b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className="fixed inset-0 -z-10 w-full h-full object-cover"
        alt=""
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className='flex flex-col h-screen w-full bg-gray-900 text-white'
      >
        {/* Builder NavBar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 no-scrollbar'
        >
          {/* left */}
          <div className='flex items-center gap-2 sm:min-w-90 text-wrap'>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Home className='h-6 cursor-pointer' onClick={() => { navigate('/') }} />
            </motion.div>

            <div className='max-w-64 sm:max-w-xs'>
              <p className='text-sm text-medium capitalize truncate'>{project.name}</p>
              <p className='text-xs text-gray-400 -mt-0.5'>Previewing last saved version</p>
            </div>

            <div className='sm:hidden flex-1 flex justify-end'>
              {isMenuOpen ?
                <MessageSquare onClick={() => setIsMenuOpen(false)} className='size-6 cursor-pointer' /> :
                <X onClick={() => setIsMenuOpen(true)} className='size-6 cursor-pointer' />}
            </div>
          </div>

          {/* middle */}
          <div className='hidden sm:flex gap-2 bg-gray-950 p-1.5 rounded-md'>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Smartphone onClick={() => setDevice('mobile')} className={`size-6 p-1 rounded cursor-pointer ${device === 'mobile' ? 'bg-gray-700' : ''}`} />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Tablet onClick={() => setDevice('tablet')} className={`size-6 p-1 rounded cursor-pointer ${device === 'tablet' ? 'bg-gray-700' : ''}`} />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Laptop onClick={() => setDevice('desktop')} className={`size-6 p-1 rounded cursor-pointer ${device === 'desktop' ? 'bg-gray-700' : ''}`} />
            </motion.div>
          </div>

          {/* right */}
          <div className='flex items-center justify-end gap-3 flex-1 text-xs sm:text-sm'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => saveProject()}
              className='max-sm:hidden group relative gap-2 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 text-white font-medium transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-80 disabled:cursor-not-allowed'
            >
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Save
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                className='max-sm:hidden group relative gap-2 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 text-white font-medium transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-80 disabled:cursor-not-allowed'
                target='_blank'
                to={`/preview/${projectId}`}
              >
                <Maximize size={16} /> Preview
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => downloadCode()}
              className='max-sm:hidden group relative gap-2 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 text-white font-medium transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-80 disabled:cursor-not-allowed'
            >
              <ArrowBigDownDash size={16} /> Download
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => togglePublish()}
              className='max-sm:hidden group relative gap-2 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 text-white font-medium transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-80 disabled:cursor-not-allowed'
            >
              {project.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
              {project.isPublished ? 'Unpublish' : 'Publish'}
            </motion.button>
          </div>
        </motion.div>

        {/* display section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className='flex-1 flex overflow-auto'
        >
          <Sidebar isMenuOpen={isMenuOpen} project={project} setProject={(p) => setProject(p)} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />

          <div className='flex-1 p-2 pl-0'>
            <ProjectPreview ref={projectPreviewRef} project={project} isGenerating={isGenerating} device={device} showEditorPanel={!isMenuOpen} />
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  ) : (
    <>
      <motion.img
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.45 }}
        transition={{ duration: 0.8 }}
        src="https://images.unsplash.com/photo-1712397943847-e104395a1a8b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className="fixed inset-0 -z-10 w-full h-full object-cover"
        alt=""
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='flex items-center justify-center h-screen'
      >
        <p className='text-2xl font-medium text-gray-200'>Unable to load project.</p>
      </motion.div>
    </>
  )
}

export default Projects