import React, { useEffect } from 'react'
import type { Project } from '../types';
import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import api from '@/configs/axios';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';


const MyProjects = () => {
  const {data:session, isPending} = authClient.useSession();
  const [loading, setLoading] = React.useState(true);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const {data} = await api.get(`/api/user/projects`);
      setProjects(data.projects);
      setLoading(false);
    } catch (error:any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to fetch projects");
      setLoading(false);
    }
  }

  const deleteProject = async( projectId:string)=>{
    try {
      const confirm = window.confirm("Are you sure you want to delete this project ?");
      if(!confirm) return;
      const {data} = await api.delete(`/api/project/${projectId}`);
      toast.success(data.message);
      fetchProjects();
    } catch (error:any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to delete project");
      setLoading(false);
    }
  }

  useEffect(() => {
    if(!isPending && !session){
      navigate('/');
      toast("Please login to view your projects");
    }else if(!isPending && session?.user){
      fetchProjects();
    }
  }, [session?.user])

  return (
    <>
      <Navbar />
      {/* BACKGROUND IMAGE */}
      <img src="https://images.unsplash.com/photo-1712397943847-e104395a1a8b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="fixed inset-0 -z-10 w-full h-full object-cover opacity-45" alt="" />
      <div className='px-4 md:px-16 lg:px-24 xl:px-32'>
        {loading ? (
          <div className='flex items-center justify-center h-[80vh]'>
            <Loader2Icon className='size-7 animate-spin text-indigo-200' />
          </div>
        ) : projects.length > 0 ? (
          <div className='py-10 min-h-[80vh]'>
            <div className='flex items-center justify-between mb-12'>
              <h1 className='text-2xl font-medium text-white'>My Projects</h1>
              
              <button onClick={() => navigate('/')}
                className='flex items-center gap-2  sm:px-6  sm:py-2   active:scale-95 transition-all group relative ml-auto justify-center bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full text-white font-medium  duration-300  hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-80 disabled:cursor-not-allowed'>
                <PlusIcon size={18} /> Create New
              </button>
            </div>
            <div className='flex flex-wrap gap-3.5 '>
              {projects.map((project) => (
                <div onClick={()=>{navigate(`/projects/${project.id}`)}}
                 key={project.id} className='relative group w-72 max-sm:mx-auto cursor-pointer bg-gray-900/60 border border-gray-700 rounded-lg overflow-hidden shadow-md group hover:shadow-indigo-700/30 hover:border-indigo-800/80 transition-all duration-300'>

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
                  {/* Content*/}
                  <div className='p-4 text-white bg-linear-180 from-transparent group-hover:from-indigo-950 to-transparent transition-colors '>
                    <div className='flex items-start justify-between'>
                      <h2 className='text-lg font-medium line-clamp-2'>
                        {project.name}
                      </h2>
                      <button className='px-2.5 py-0.5 mt-1 ml-2 text-xs bg-indigo-600 border border-gray-700 rounded-full' >
                        Website
                      </button>
                    </div>
                    
                    <p className='text-gray-400 mt-1 text-sm line-clamp-2  '>{project.initial_prompt}</p>

                    <div onClick={(e) => { e.stopPropagation() }} className='flex justify-between items-center mt-6'>
                      <span className='text-xs text-gray-500'>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <div className='flex gap-3 text-white text-sm items-bottom'>
                        <button onClick={()=>{navigate(`/preview/${project.id }`)}} className='px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md transition-all'>
                          Preview
                        </button>
                        <button onClick={()=>{navigate(`/projects/${project.id }`)}} className='px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md transition-all'>
                          Open
                        </button>
                      </div>
                    </div>
                  </div>
                  <div onClick={(e)=>{e.stopPropagation()}}>
                    <TrashIcon className='absolute top-3 right-3 scale-0 group-hover:scale-100 bg-white p-1.5 size-7 rounded text-red-500 text-xl cursor-pointer transition-all' onClick={()=>{deleteProject(project.id)}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-[80vh]'>
            <h1 className='text-4xl font-semibold text-white mb-4'>No Projects Found !</h1>
            <button onClick={() => { navigate('/') }}
              className='text-white px-5 py-2 mt-5 rounded-md bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all'> Create New
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default MyProjects