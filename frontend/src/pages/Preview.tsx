import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Loader2Icon } from "lucide-react"
import ProjectPreview from "../components/ProjectPreview"
import type { Project, Version } from "../types"
import api from "@/configs/axios"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { motion } from "framer-motion"
import PageTransition from "../components/PageTransition"

const Preview = () => {
  const { data: session, isPending } = authClient.useSession();
  const { projectId, versionId } = useParams()
  const navigate = useNavigate();
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchCode = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/project/preview/${projectId}`)

      if (versionId) {
        const version = data.project.versions.find((v: Version) => v.id === versionId);
        setCode(version ? version.code : data.project.current_code);
      } else {
        setCode(data.project.current_code);
      }

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch project preview");
      console.error(error);

      if (error?.response?.status === 401) {
        navigate('/auth/signin');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        fetchCode();
      } else {
        navigate('/auth/signin');
      }
    }
  }, [isPending, session?.user, projectId, versionId])

  if (loading || isPending) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex justify-center items-center h-screen bg-gray-950'
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Loader2Icon className='size-7 text-indigo-500' />
        </motion.div>
      </motion.div>
    )
  }

  if (!code) {
    return (
      <PageTransition>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='flex flex-col justify-center items-center h-screen bg-gray-950 text-white'
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className='text-2xl font-semibold mb-4'>No Preview Available</h2>
            <p className='text-gray-400'>Unable to load the project preview.</p>
          </motion.div>
        </motion.div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="h-screen"
      >
        <ProjectPreview
          project={{ current_code: code } as Project}
          isGenerating={false}
          showEditorPanel={false}
        />
      </motion.div>
    </PageTransition>
  )
}

export default Preview