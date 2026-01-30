import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import type { Project } from '../types';
import { ArrowBigDownDash, Eye, EyeOff, Maximize, Home, Laptop, Loader2, MessageSquareCode, MessageSquare, Save, Smartphone, Tablet, X } from 'lucide-react';
import { dummyConversations, dummyProjects, dummyVersion } from '../assets/assets';
import Sidebar from '../components/Sidebar';
import ProjectPreview, { type ProjectPreviewRef } from '../components/ProjectPreview';

const Projects = () => {
  const { projectId } = useParams()
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isGenerating, setIsGenerating] = useState<boolean>(true)
  const [device, setDevice] = useState<'desktop' | 'mobile' | 'tablet'>('desktop')
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const projectPreviewRef = useRef<ProjectPreviewRef>(null);

  const fetchProject = async () => {
    const project = dummyProjects.find((proj) => proj.id === projectId);
    setTimeout(() => {
      if (project) {
        setProject({ ...project, conversation: dummyConversations, versions: dummyVersion });
        setLoading(false);
        setIsGenerating(project.current_code ? false : true);
        console.log(project);
      }
    }, 2000);
  }

  const saveProject = async () => {

  }

  //Download the code as a zip file -- index.html
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

  }


  useEffect(() => {
    fetchProject();
  }, [])

  if (loading) {
    return (
      <>
        {/* BACKGROUND IMAGE */}
        <img src="https://images.unsplash.com/photo-1712397943847-e104395a1a8b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="fixed inset-0 -z-10 w-full h-full object-cover opacity-45" alt="" />
        <div className='flex items-center justify-center h-screen '>
          <Loader2 className="animate-spin text-white" />
        </div>
      </>
    )
  }

  return project ? (
    <>
      {/* BACKGROUND IMAGE */}
      <img src="https://images.unsplash.com/photo-1712397943847-e104395a1a8b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="fixed inset-0 -z-10 w-full h-full object-cover opacity-45" alt="" />

      <div className='flex flex-col h-screen w-full bg-gray-900 text-white'>
        {/*Builder NavBar  */}
        <div className='flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 no-scrollbar'>
          {/* left */}
          <div className='flex items-center gap-2 sm:min-w-90 text-wrap'>
            <Home className='h-6 cursor-pointer' onClick={() => { navigate('/') }} />

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
            <Smartphone onClick={() => setDevice('mobile')} className={`size-6 p-1 rounded cursor-pointer ${device === 'mobile' ? 'bg-gray-700' : ''}`} />

            <Tablet onClick={() => setDevice('tablet')} className={`size-6 p-1 rounded cursor-pointer ${device === 'tablet' ? 'bg-gray-700' : ''}`} />

            <Laptop onClick={() => setDevice('desktop')} className={`size-6 p-1 rounded cursor-pointer ${device === 'desktop' ? 'bg-gray-700' : ''}`} />
          </div>

          {/* right */}
          <div className='flex items-center justify-end gap-3 flex-1 text-xs sm:text-sm '>
            <button onClick={() => saveProject()}
              className='max-sm:hidden group relative gap-2 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5  text-white font-medium transition-all duration-300 active:scale-95 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-80 disabled:cursor-not-allowed'>
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Save
            </button>

            <Link className='max-sm:hidden group relative gap-2 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5  text-white font-medium transition-all duration-300 active:scale-95 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-80 disabled:cursor-not-allowed'
              target='_blank' to={`/preview/${projectId}`}>
              <Maximize size={16} /> Preview
            </Link>

            <button onClick={() => downloadCode()}
              className='max-sm:hidden group relative gap-2 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5  text-white font-medium transition-all duration-300 active:scale-95 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-80 disabled:cursor-not-allowed'>
              <ArrowBigDownDash size={16} /> Download
            </button>

            <button onClick={() => togglePublish()}
              className='max-sm:hidden group relative gap-2 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5  text-white font-medium transition-all duration-300 active:scale-95 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-80 disabled:cursor-not-allowed'>
              {project.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
              {project.isPublished ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>
        {/* display- section */}
        <div className='flex-1 flex overflow-auto'>

          <Sidebar isMenuOpen={isMenuOpen} project={project} setProject={(p) => setProject(p)} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />

          <div className='flex-1 p-2 pl-0'>
            <ProjectPreview ref={projectPreviewRef} project={project} isGenerating={isGenerating} device={device} showEditorPanel={!isMenuOpen} />
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <img src="https://images.unsplash.com/photo-1712397943847-e104395a1a8b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="fixed inset-0 -z-10 w-full h-full object-cover opacity-45" alt="" />

      <div className='flex items-center justify-center h-screen'>
        <p className='text-2xl font-medium text-gray-200'>Unable to load project.</p>
      </div>
    </>
  )
}

export default Projects