import { Loader2Icon } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import Navbar from '../components/Navbar'

const Home = () => {
      const [input, setInput] = useState("")
      const [loading, setLoading] = useState(false)
      const onSubmitHandler = (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            //simulate APi call

            setTimeout(() => {
                  setLoading(false);
            }, 3000)
      }



      return (
            <>
                  <Navbar/>
                  <section className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins">
                        {/* BACKGROUND IMAGE */}
                        <img src="https://images.unsplash.com/photo-1712397943847-e104395a1a8b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="fixed inset-0 -z-10 w-full h-full object-cover opacity-45" alt="" />

                        <a className="flex items-center gap-2 border border-slate-700 rounded-full p-1 pr-3 text-sm mt-20">
                              <span className="bg-indigo-600 text-xs px-3 py-1 rounded-full">NEW</span>
                              <p className="flex items-center gap-2">
                                    <span>Try 30 days free trial option</span>
                                    <svg className="mt-px" width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m1 1 4 3.5L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              </p>
                        </a>

                        <h1 className="text-center text-[40px] leading-[48px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-3xl">
                              Turn thoughts into websites instantly, with AI.
                        </h1>

                        <p className="text-center text-base max-w-md mt-2">
                              Create, customize and present faster than ever with intelligent design powered by AI.
                        </p>

                        <form onSubmit={onSubmitHandler} className="bg-white/10 max-w-2xl w-full rounded-xl p-4 mt-10 border border-blue-400/70 focus-within:ring-2 ring-indigo-500 transition-all">

                              <textarea onChange={e => setInput(e.target.value)} className="bg-transparent outline-none text-gray-300 resize-none w-full" rows={4} placeholder="Describe your presentation in details" required />


                              <button
                                    
                                    disabled={loading}
                                    className="group relative ml-auto flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full text-white font-medium transition-all duration-300 active:scale-95 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-80 disabled:cursor-not-allowed"
                                    >
                                    {loading ? (
                                          // STATE: Loading (Static content, no hover animation)
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
                              </button>
                              {/* <button className="ml-auto flex items-center gap-2 bg-gradient-to-r from-[#375c76] to-indigo-600 rounded-md px-4 py-2">
                              {!loading ? 'Creating with AI' :(
                                    <>
                                    Creating <Loader2Icon className='animate-spin size-4 text-white'/>
                                    </>
                              )}
                        </button> */}
                        </form>


                  </section>
            </>
      )
}

export default Home