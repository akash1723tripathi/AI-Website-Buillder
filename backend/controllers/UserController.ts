import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import openai from "../config/openAi.js";

// Get user Credits
export const getUserCredits = async (req: Request, res: Response) => {
      try {
            const UserId = req.UserId;
            if (!UserId) {
                  return res.status(401).json({ message: "Unauthorized" })
            }
            // Fetch user credits from database
            const user = await prisma.user.findUnique({
                  where: { id: UserId }
            })

            res.json({ credits: user?.credits });
      } catch (error: any) {
            console.log(error.code || error.message);
            res.status(500).json({ message: error.message })
      }
}


//To create new projects

export const createUserProjects = async (req: Request, res: Response) => {
      const UserId = req.UserId;
      try {
            const { initial_prompt } = req.body;
            if (!UserId) {
                  return res.status(401).json({ message: "Unauthorized" })
            }

            const user = await prisma.user.findUnique({
                  where: { id: UserId }
            })

            if (user && user.credits < 5) {
                  return res.status(403).json({ message: "Insufficient credits" })
            }

            //Create a new project
            const project = await prisma.websiteProject.create({
                  data: {
                        name: initial_prompt.length > 50 ? initial_prompt.substring(0, 45) + '...' : initial_prompt,
                        initial_prompt,
                        userId: UserId
                  }
            })

            //Update user total creation
            await prisma.user.update({
                  where: { id: UserId },
                  data: { totalCreation: { increment: 1 } }
            })

            await prisma.conversation.create({
                  data: {
                        role: 'user',
                        content: initial_prompt,
                        projectId: project.id
                  }
            })

            await prisma.user.update({
                  where: { id: UserId },
                  data: { credits: { decrement: 5 } }
            })

            res.json({ projectId: project.id });

            //Enhance User prompt

            const promptEnhanceResponse = await openai.chat.completions.create({
                  model: "z-ai/glm-4.5-air:free",
                  messages: [
                        {
                              "role": "system",
                              "content": `
                              You are a prompt enchancement specialist. TAke the user's request and expand it into a detailed,comprehensive prompt that will help an AI system generate a complete website.

                              Enhance this prompt by :
                              1. Adding specific design details (layout, color scheme, typography).
                              2. Including functional requirements (navigation, interactivity, responsiveness).
                              3. Specifying content elements (text, images, multimedia).
                              4. Considering user experience (ease of use, accessibility).
                              5. Making sure the prompt is clear and unambiguous.
                              6.Include Mordern webs design trends and best practices.

                              Return ONLY the Enhanced prompt.Nothing else. Make it detailed but concise(2-3 paragraph max).
                              `
                        }
                  ]
            })

      } catch (error: any) {
            console.log(error.code || error.message);
            res.status(500).json({ message: error.message })
      }
}

