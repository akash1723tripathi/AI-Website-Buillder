import React from "react"
import { appPlans } from "../assets/assets"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

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

  const handlePurchase = (planId: string) => {
    // Implement purchase logic here
    console.log(`Purchasing plan with ID: ${planId}`);
  }

  return (
    <>
      <Navbar/>
      <img src="https://images.unsplash.com/photo-1712397943847-e104395a1a8b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="fixed inset-0 -z-10 w-full h-full object-cover opacity-45" alt="" />

      <div className="w-full max-w-5xl mt-5 mx-auto max-md:px-4 min-h-[80vh] z-20">
        <div className="text-center " >
          <h2 className=" text-gray-100 text-4xl font-bold mb-3 ">Choose Your Plan</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto mt-2">Start for free and scale up as you grow. Find the perfect plan fro your creation needs.</p>
        </div>

        <div className='pt-14 py-4 px-4 '>
          <div className='grid grid-cols-1 md:grid-cols-3 flex-wrap gap-4'>
            {plans.map((plan, idx) => (
              <div key={idx} className="p-6 bg-black/20 ring ring-indigo-950 mx-auto w-full max-w-sm rounded-lg text-white shadow-lg hover:ring-indigo-500 transition-all duration-400">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="my-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-300"> / {plan.credits} credits</span>
                </div>

                <p className="text-gray-300 mb-6">{plan.description}</p>

                <ul className="space-y-1.5 mb-6 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="h-5 w-5 text-indigo-300 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handlePurchase(plan.id)} className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-sm rounded-md transition-all">
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
        <p className="mx-auto text-center text-sm max-w-md mt-10 text-white/60 font-light">Project <span className="text-white">Creation/Revision</span> consume <span className="text-white">5 credits</span>. You can purchase more credits by selecting a plan above on top of the existing plan.</p>
      </div>
      <Footer/>
    </>
  )
}

export default Pricing