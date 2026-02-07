import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import type { Project } from "../types";
import { iframeScript } from "../assets/assets";
import EditorPanel from "./EditorPanel";
import LoaderSteps from "./LoaderSteps";

export interface ProjectPreviewRef {
      getCode: () => string | undefined;
}

interface ProjectPreviewProps {
      project: Project;
      isGenerating: boolean;
      device?: 'desktop' | 'mobile' | 'tablet';
      showEditorPanel?: boolean;
}

const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(({ project, isGenerating, device = 'desktop', showEditorPanel = true }, ref) => {

      const iframeRef = useRef<HTMLIFrameElement>(null);
      const [selectedElement,setSelectedElement] = useState<any>(null)

      useEffect(()=>{
            const handleMessage = (e: MessageEvent) => {
            if(e.data.type === 'ELEMENT_SELECTED'){
                        setSelectedElement(e.data.payload);
                  }else if(e.data.type === 'CLEAR_SELECTION'){
                        setSelectedElement(null);
                  }
            }
            window.addEventListener('message', handleMessage);
            return () => {
                  window.removeEventListener('message', handleMessage);
            };
      },[])

      const handleUpdate = (updates: any)=>{
            if(iframeRef.current?.contentWindow){
                  iframeRef.current.contentWindow.postMessage({
                        type:'UPDATE_ELEMENT',
                        payload:updates
                  },'*');
            }

      }

      const resolutions = {
            mobile:'w-[412px]',
            tablet: 'w-[768px]',
            desktop: 'w-full'
      }

      useImperativeHandle(ref,()=>({
            getCode: ()=>{
                  const doc = iframeRef.current?.contentDocument;
                  if(!doc) return undefined;

                  //Remove the selection highlight before getting the code
                  doc.querySelectorAll('.ai-selected-element,[data-ai-selected]').
                  forEach((el)=>{
                        el.classList.remove('ai-selected-element');
                        el.removeAttribute('data-ai-selected');
                        (el as HTMLElement).style.outline = '';
                  });
                  //Remove any injected scripts
                  const previewStyle = doc.getElementById('ai-preview-style');
                  if(previewStyle){
                        previewStyle.remove();
                  }

                  const previewScript = doc.getElementById('ai-preview-script');
                  if(previewScript){
                        previewScript.remove();
                  }

                  //Serrialize the document
                  const html = doc.documentElement.outerHTML;
                  return html;
            }
      }))

      const injectPreview= (html:string)=>{
            if(!html) return "";
            if(!showEditorPanel){
                  return html;
            }
            if(html.includes('</body>')){
                  return html.replace('</body>', iframeScript + '</body>');
            }else{
                  return html + iframeScript;
            }
      }

      return (
            <>
                  <div className="relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2 border-2">
                        {project.current_code ? (
                              <>
                                    <iframe
                                          ref={iframeRef}
                                          srcDoc={injectPreview(project.current_code)}
                                          className={`h-full max-sm:w-full ${resolutions[device]} mx-auto transition-all`}
                                    />
                                    {showEditorPanel && selectedElement && (
                                          <EditorPanel selectedElement={selectedElement} onUpdate={handleUpdate} onClose={() => {
                                                setSelectedElement(null);
                                                if(iframeRef.current?.contentWindow){
                                                      iframeRef.current.contentWindow.postMessage({type:'CLEAR_SELECTION_REQUEST'},'*'); 
                                                }
                                          }}/>
                                    )}
                              </>
                        ) :
                              isGenerating && (
                                    <div>
                                          <LoaderSteps />
                                    </div>
                              )
                        }
                  </div>

            </>
      )
})

export default ProjectPreview