import React from "react"
import { appPlans } from "../assets/assets"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import api from "@/configs/axios"
import { motion } from "framer-motion"
import PageTransition from "../components/PageTransition"

interface Plan {
  id: string,
  name: string,
  price: string,
  credits: number,
  description: string,
  features: string[]
}

const Pricing = () => {
  const [plans] = React.useState<Plan[]>(appPlans)
  const { data: session } = authClient.useSession()

  const handlePurchase = async (planId: string) => {
    try {
      if (!session?.user) {
        return toast.error("Please login to purchase a plan")
      }

      console.log('Sending planId:', planId);
      
      const { data } = await api.post('/api/user/purchase-credits', { planId })
      
      console.log('Response:', data);
      
      if (data.payment_link) {
        window.location.href = data.payment_link
      } else {
        toast.error("Failed to get payment link")
      }
      
    } catch (error: any) {
      console.error('Purchase error:', error);
      console.error('Error response:', error?.response);
      toast.error(error?.response?.data?.message || "Failed to initiate purchase. Please try again.")
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  };

  const featureVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1
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

      <motion.img
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.45 }}
        transition={{ duration: 0.8 }}
        src="https://images.unsplash.com/photo-1712397943847-e104395a1a8b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className="fixed inset-0 -z-10 w-full h-full object-cover"
        alt=""
      />

      <div className="w-full max-w-5xl mt-5 mx-auto max-md:px-4 min-h-[80vh] z-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-100 text-4xl font-bold mb-3"
          >
            Choose Your Plan
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-400 text-sm max-w-md mx-auto mt-2"
          >
            Start for free and scale up as you grow. Find the perfect plan for your creation needs.
          </motion.p>
        </motion.div>

        <div className='pt-14 py-4 px-4'>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className='grid grid-cols-1 md:grid-cols-3 flex-wrap gap-4'
          >
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="p-6 bg-black/20 ring ring-indigo-950 mx-auto w-full max-w-sm rounded-lg text-white shadow-lg hover:ring-indigo-500 hover:shadow-indigo-500/20 transition-all duration-400"
              >
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="text-xl font-bold"
                >
                  {plan.name}
                </motion.h3>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="my-2"
                >
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-300"> / {plan.credits} credits</span>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className="text-gray-300 mb-6"
                >
                  {plan.description}
                </motion.p>

                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.8 + idx * 0.1
                      }
                    }
                  }}
                  className="space-y-1.5 mb-6 text-sm"
                >
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      variants={featureVariants}
                      className="flex items-center"
                    >
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.9 + idx * 0.1 + i * 0.05 }}
                        className="h-5 w-5 text-indigo-300 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </motion.svg>
                      <span className="text-gray-400">{feature}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + idx * 0.1 }}
                  onClick={() => handlePurchase(plan.id)}
                  className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-sm rounded-md transition-all relative overflow-hidden group"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <span className="relative z-10">Buy Now</span>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mx-auto text-center text-sm max-w-md mt-10 text-white/60 font-light"
        >
          Project <span className="text-white">Creation/Revision</span> consume <span className="text-white">5 credits</span>.
          You can purchase more credits by selecting a plan above on top of the existing plan.
        </motion.p>
      </div>
    </PageTransition>
  )
}

export default Pricing