import React, { useEffect } from 'react'
import type { Project } from '../types';
import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dummyProjects } from '../assets/assets';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Community = () => {
  const [loading, setLoading] = React.useState(true);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setProjects(dummyProjects)

    //simulate api call
    setTimeout(() => {
      setLoading(false);
    }, 1000)
  }


  useEffect(() => {
    fetchProjects();
  }, [])

  return (
    <>
      <Navbar/>
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
              <h1 className='text-2xl font-medium text-white'>Published Projects</h1>
            </div>
            <div className='flex flex-wrap gap-3.5 '>
              {projects.map((project) => (
                <Link  
                 key={project.id} 
                 to={`/projects/${project.id}`}
                 target='_blank'
                 className='w-72 max-sm:mx-auto cursor-pointer bg-gray-900/60 border border-gray-700 rounded-lg overflow-hidden group hover:border-indigo-800/80 transition-all duration-300'>

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
                    
                    <p className='text-gray-400 mt-1 text-sm line-clamp-2'>{project.initial_prompt}</p>

                    <div className='flex justify-between items-center mt-6'>
                      <span className='text-xs text-gray-500'>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <div className='flex gap-3 text-white text-sm items-bottom'>
                        <button className='px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md  transition-colors flex items-center gap-2'>
                          <span className='bg-gray-200 size-4.5 rounded-full text-black font-semibold flex items-center justify-center'>
                            {project.user?.name?.slice(0,1)}
                          </span>
                          {project.user?.name}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
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

export default Community