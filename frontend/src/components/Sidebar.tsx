import { BotIcon, EyeIcon, Loader2Icon, SendIcon, UserIcon } from "lucide-react";
import type { Message, Project, Version } from "../types";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "@/configs/axios";
import { toast } from "sonner";


interface SidebarProps {
      isMenuOpen: boolean;
      project: Project;
      setProject: (project: Project) => void;
      isGenerating: boolean;
      setIsGenerating: (setIsGenerating: boolean) => void;
}



const Sidebar = ({ isMenuOpen, project, setProject, isGenerating, setIsGenerating }: SidebarProps) => {

      const [input, setInput] = useState<string>('');

      const handleRollback = async (versionId: string) => {
            try {
                  const confirm = window.confirm('Are you sure you want to roll back to this version? Any unsaved changes will be lost.')
                  if(!confirm) return;
                  setIsGenerating(true);
                  const { data } = await api.get(`/api/project/rollback/${project.id}/${versionId}`);
                  const { data:data2 } = await api.get(`/api/user/project/${project.id}`);
                  setProject(data2.project);
                  toast.success(data.message);
                  setIsGenerating(false);
            } catch (error:any) {
                  setIsGenerating(false);
                  toast.error(error?.response?.data?.message || 'Failed to roll back to this version')
                  console.log(error)
            }
      }

      const fetchProject = async () => {
            try {
                  const {data} = await api.get(`/api/user/project/${project.id}`)
                  setProject(data.project)
            } catch (error:any) {
                  toast.error(error?.response?.data?.message || 'Failed to load project')
                  console.log(error)
            }
      }

      const handleRevisions = () => async (e: React.FormEvent) => {
            e.preventDefault();
            let interval: number | undefined;
            try {
                  setIsGenerating(true);
                  interval = setInterval(() => {
                        fetchProject();
                  }, 10000);
                  const { data } = await api.post(`/api/project/revision/${project.id}`, { revision_prompt: input });
                  fetchProject();
                  toast.success(data.message);
                  setInput('');
                  clearInterval(interval);
                  setIsGenerating(false);
            } catch (error:any) {   
                  setIsGenerating(false);
                  toast.error(error?.response?.data?.message || 'Failed to submit your request')
                  console.log(error)
                  clearInterval(interval);
            }

      }
      const messagesEndRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
            if (messagesEndRef.current) {
                  messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
      }, [project.conversation.length, isGenerating]);

      return (
            <div className={`h-full sm:max-w-sm rounded-xl bg-gray-900 border-gray-800 transition-all ${isMenuOpen ? 'max-sm:w-0 overflow-hidden' : 'w-full'}`}>
                  <div className="flex flex-col h-full">
                        {/* Message Container */}
                        <div className="flex-1 overflow-auto no-scrollbar px-3 flex flex-col gap-4">

                              {[...project.conversation, ...project.versions]
                                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((message) => {
                                          const isMessage = 'content' in message;

                                          if (isMessage) {
                                                const msg = message as Message;
                                                const isUser = msg.role === 'user';
                                                return (
                                                      <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
                                                            {!isUser && (
                                                                  <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold">
                                                                        <BotIcon size={20} className="text-white" />
                                                                  </div>
                                                            )}
                                                            <div className={`max-w-[80%] p-2 px-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'bg-linear-to-br from-indigo-500 to-indigo-600text-white rounded-tr-none' : 'bg-gray-800 text-gray-100 rounded-tl-none'}`}>
                                                                  {msg.content}
                                                            </div>
                                                            {isUser && (
                                                                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                                                                        <UserIcon size={24} className="text-gray-200" />
                                                                  </div>
                                                            )}
                                                      </div>
                                                )
                                          }
                                          else {
                                                const vr = message as Version;
                                                return (
                                                      <div key={vr.id} className="w-4/5 mx-auto my-2 p-3 rounded-xl bg-gray-800 text-gray-100 shadow flex flex-col">
                                                            <div className="text-xs font-medium">
                                                                  Code Updated <br />
                                                                  <span className="text-gray-500 text-xs font-normal">
                                                                        {new Date(vr.timestamp).toLocaleString()}
                                                                  </span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                  {project.current_version_index === vr.id ?
                                                                        (<button className="px-3 py-1 rounded-md text-xs bg-gray-700">
                                                                              Current Version
                                                                        </button>) :
                                                                        (<button onClick={() => handleRollback(vr.id)}
                                                                              className="px-3 py-1 rounded-md text-xs bg-indigo-500 hover:bg-indigio-600 transition text-white">
                                                                              Roll Back to this version
                                                                        </button>)
                                                                  }
                                                                  <Link target="_blank" to={`/preview/${project.id}/${vr.id}`}>
                                                                        <EyeIcon size={6} className="p-1
                                                                  bg-gray-700 hover:bg-indigo-500 transition-colors rounded" />
                                                                  </Link>
                                                            </div>
                                                      </div>
                                                )
                                          }
                                    })}
                              {isGenerating && (
                                    <div className="flex items-start gap-3 justify-start">
                                          <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold">
                                                <BotIcon size={5} className="text-white" />
                                          </div>
                                          <div className="flex gap-1.5 h-full items-end">
                                                <span className="size-2 rounded-full animate-bounce bg-gray-600" style={{ animationDelay: '0s' }} />
                                                <span className="size-2 rounded-full animate-bounce bg-gray-600" style={{ animationDelay: '0.2s' }} />
                                                <span className="size-2 rounded-full animate-bounce bg-gray-600" style={{ animationDelay: '0.4s' }} />
                                          </div>
                                    </div>
                              )}
                              <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleRevisions()}
                              className="m-3 relative" >
                              <div className="flex items-center gap-2">
                                    <textarea onChange={(e) => { setInput(e.target.value) }} value={input}
                                          rows={4} placeholder="Describe your website or request changes" className=" flex-1 p-3 rounded-xl resize-none text-sm outline-none ring ring-gray-700 focus:ring-indigo-500 bg-gray-800
                                    text-gray-100 placeholder-gray-400 transition-all" disabled={isGenerating} />
                                    <button disabled={isGenerating || input.trim() === ''}
                                          className="absolute bottom-2.5 right-2.5   rounded-full bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white transition-colors disable:opacity-60">
                                          {isGenerating ?
                                                <Loader2Icon className="animate-spin text-gray-400 size-7 p-1.5" /> :
                                                <SendIcon size={24} className="text-gray-400 size-7 p-1.5" />
                                          }
                                    </button>
                              </div>
                        </form>
                  </div>
            </div>
      )
}

export default Sidebar