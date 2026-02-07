import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import openai from "../config/openAi.js";
import { role } from "better-auth/plugins";

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
                  model: "tngtech/deepseek-r1t2-chimera:free",
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
                        }, {
                              role: "user",
                              content: initial_prompt
                        }
                  ]
            })

            const enhancedPrompt = promptEnhanceResponse.choices[0].message?.content;

            await prisma.conversation.create({
                  data: {
                        role: 'assistant',
                        content: `I have enhanced your prompt to : ${enhancedPrompt}`,
                        projectId: project.id
                  }
            })

            await prisma.conversation.create({
                  data: {
                        role: 'assistant',
                        content: `Generating your website with the enhanced prompt..`,
                        projectId: project.id
                  }
            })

            //Generate website code 
            const codeGenerationResponse = await openai.chat.completions.create({
                  model: "tngtech/deepseek-r1t2-chimera:free",
                  messages: [
                        {
                              role: 'system',
                              content: `
                              You are an expert web developer. Create a complete, production-ready, single-page website based on this request: "${enhancedPrompt}"

                              CRITICAL REQUIREMENTS:
                              - You MUST output valid HTML ONLY. 
                              - Use Tailwind CSS for ALL styling
                              - Include this EXACT script in the <head>: <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
                              - Use Tailwind utility classes extensively for styling, animations, and responsiveness
                              - Make it fully functional and interactive with JavaScript in <script> tag before closing </body>
                              - Use modern, beautiful design with great UX using Tailwind classes
                              - Make it responsive using Tailwind responsive classes (sm:, md:, lg:, xl:)
                              - Use Tailwind animations and transitions (animate-*, transition-*)
                              - Include all necessary meta tags
                              - Use Google Fonts CDN if needed for custom fonts
                              - Use placeholder images from https://placehold.co/600x400
                              - Use Tailwind gradient classes for beautiful backgrounds
                              - Make sure all buttons, cards, and components use Tailwind styling

                              CRITICAL HARD RULES:
                              1. You MUST put ALL output ONLY into message.content.
                              2. You MUST NOT place anything in "reasoning", "analysis", "reasoning_details", or any hidden fields.
                              3. You MUST NOT include internal thoughts, explanations, analysis, comments, or markdown.
                              4. Do NOT include markdown, explanations, notes, or code fences.

                              The HTML should be complete and ready to render as-is with Tailwind CSS.`
                        },{
                              role: 'user',
                              content : enhancedPrompt || " "
                        }
                  ]
            })
            const code = codeGenerationResponse.choices[0].message?.content || "";

            if (!code) {
                  await prisma.conversation.create({
                        data: {
                              role: "assistant",
                              content: `Unable to generate the code, Please try again`,
                              projectId : project.id
                        }
                  })

                  await prisma.user.update({
                        where: { id: UserId },
                        data: {
                              credits: { increment: 5 }
                        }
                  })
                  return;
            }

            //create version for the project
            const version = await prisma.version.create({
                  data:{
                        code: code.replace(/```[a-z]*\n/gi, '').replace(/```/g, '').trim(),
                        description: "Initial version",
                        projectId: project.id
                  }
            })

            await prisma.conversation.create({
                  data: {
                        role: 'assistant',
                        content: `Your website has been generated successfully! You can preview it , and request any changes. `,
                        projectId: project.id
                  }
            })

            await prisma.websiteProject.update({
                  where: { id: project.id },
                  data: {
                        current_code: code.replace(/```[a-z]*\n/gi, '').replace(/```/g, '').trim(),
                        current_version_index: version.id
                  }
            })

      } catch (error: any) {
            await prisma.user.update({
                  where: { id: UserId },
                  data: { credits: { increment: 5 } }
            })
            console.log(error.code || error.message);
            res.status(500).json({ message: error.message })
      }
}

//Controller to get a single user project
export const getUserProject = async (req: Request, res: Response) => {
      try {
            const UserId = req.UserId;
            if (!UserId) {
                  return res.status(401).json({ message: "Unauthorized" })
            }
            
            const { projectId } = req.params;
            const project = await prisma.websiteProject.findUnique({
                  where: { id: projectId, userId: UserId },
                  include: {
                        conversation:{
                              orderBy:{timestamp: 'asc'}
                        },
                        versions:{
                              orderBy:{timestamp: 'asc'}
                        }
                  }
            })

            res.json({ project });

      } catch (error: any) {
            console.log(error.code || error.message);
            res.status(500).json({ message: error.message })
      }
} 


//Controller to get all user projects
export const getUserProjects = async (req: Request, res: Response) => {
      try {
            const UserId = req.UserId;
            if (!UserId) {
                  return res.status(401).json({ message: "Unauthorized" })
            }
            
            const projects = await prisma.websiteProject.findMany({
                  where: { userId: UserId },
                  orderBy:{
                        updatedAt: 'desc'
                  }
            })

            res.json({ projects });
      } catch (error: any) {
            console.log(error.code || error.message);
            res.status(500).json({ message: error.message })
      }
}

//To toggle project publish
export const togglePublish = async (req: Request, res: Response) => {
      try {
            const UserId = req.UserId;
            if (!UserId) {
                  return res.status(401).json({ message: "Unauthorized" })
            }
            
            const { projectId } = req.params;
            const project = await prisma.websiteProject.findUnique({
                  where: { id: projectId, userId: UserId }
            })

            if(!project){
                  return res.status(404).json({ message: "Project not found" })
            }

            await prisma.websiteProject.update({
                  where: { id: projectId },
                  data: { isPublished: !project.isPublished }
            })
            
            res.json({ message:project.isPublished ? "Project unpublished " : "Project published successfully" });
      } catch (error: any) {
            console.log(error.code || error.message);
            res.status(500).json({ message: error.message })
      }
}


//Controller function to purchase credits

export const purchaseCredits = async (req: Request, res: Response) => {}
      