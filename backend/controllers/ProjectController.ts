import { Request, Response } from 'express';
import prisma from "../lib/prisma.js";
import openai from "../config/openAi.js";
import { versions } from 'node:process';


//Controller Function to make revisions
export const makeRevision = async (req: Request, res: Response) => {
      const UserId = req.UserId;
      try {
            const { projectId } = req.params;
            const { revision_prompt } = req.body;
            const user = await prisma.user.findUnique({
                  where: { id: UserId }
            })

            if (!UserId || !user) {
                  return res.status(401).json({ message: "Unauthorized" })
            }

            if (user.credits < 5) {
                  return res.status(403).json({ message: "Not enough credits" })
            }

            if (!revision_prompt || revision_prompt.trim() === "") {
                  return res.status(400).json({ message: "Revision prompt is required" })
            }

            const currentProject = await prisma.websiteProject.findUnique({
                  where: { id: projectId, userId: UserId },
                  include: { versions: true }
            })

            if (!currentProject) {
                  return res.status(404).json({ message: "Project not found" })
            }

            await prisma.conversation.create({
                  data: {
                        role: "user",
                        content: revision_prompt,
                        projectId
                  }
            })

            await prisma.user.update({
                  where: { id: UserId },
                  data: {
                        credits: { decrement: 5 }
                  }
            })

            //To enhacne user prompt
            const promptEnhanceResponse = await openai.chat.completions.create({
                  model: "tngtech/deepseek-r1t2-chimera:free",
                  messages: [
                        {
                              role: "system",
                              content: `
                              You are a prompt enhancement specialist. The user wants to make changes to their website. Enhance their request to be more specific and actionable for a web developer.

                              Enhance this by:
                              1. Being specific about what elements to change
                              2. Mentioning design details (colors, spacing, sizes)
                              3. Clarifying the desired outcome
                              4. Using clear technical terms

                              Return ONLY the enhanced request, nothing else. Keep it concise (1-2 sentences).`
                        }, {
                              role: "user",
                              content: ` User's request "${revision_prompt}" `
                        }
                  ]
            })

            const enhancedPrompt = promptEnhanceResponse.choices[0].message.content;

            await prisma.conversation.create({
                  data: {
                        role: "assistant",
                        content: `I have enhanced your prompt to "${enhancedPrompt}"`,
                        projectId
                  }
            })

            await prisma.conversation.create({
                  data: {
                        role: "assistant",
                        content: `Now making changes to your website...`,
                        projectId
                  }
            })

            //Generate website code
            const codeGenerationResponse = await openai.chat.completions.create({
                  model: "tngtech/deepseek-r1t2-chimera:free",
                  messages: [
                        {
                              role: "system",
                              content: `
                              You are an expert web developer. 

                              CRITICAL REQUIREMENTS:
                              - Return ONLY the complete updated HTML code with the requested changes.
                              - Use Tailwind CSS for ALL styling (NO custom CSS).
                              - Use Tailwind utility classes for all styling changes.
                              - Include all JavaScript in <script> tags before closing </body>
                              - Make sure it's a complete, standalone HTML document with Tailwind CSS
                              - Return the HTML Code Only, nothing else

                              Apply the requested changes while maintaining the Tailwind CSS styling approach.`
                        }, {
                              role: "user",
                              content: ` Here's the current website code "${currentProject.current_code}" The user wants this change :"${enhancedPrompt}" `
                        }
                  ]
            })

            const code = codeGenerationResponse.choices[0].message.content || '';

            if (!code) {
                  await prisma.conversation.create({
                        data: {
                              role: "assistant",
                              content: `Unable to generate the code, Please try again`,
                              projectId
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



            const version = await prisma.version.create({
                  data: {
                        code: code.replace(/```[a-z]*\n/gi, '').replace(/```/g, '').trim(),
                        description: 'Changes made',
                        projectId
                  }
            })

            await prisma.conversation.create({
                  data: {
                        role: "assistant",
                        content: `I've made the changes to your website. You can now preview it.`,
                        projectId
                  }
            })

            await prisma.websiteProject.update({
                  where: { id: projectId },
                  data: {
                        current_code: code.replace(/```[a-z]*\n/gi, '').replace(/```/g, '').trim(),
                        current_version_index: version.id
                  }
            })

            res.json({ message: "changes made successfully" })
      }
      catch (error: any) {
            await prisma.user.update({
                  where: { id: UserId },
                  data: {
                        credits: { increment: 5 }
                  }
            })
            console.log(error.code || error.message);
            res.status(500).json({ message: error.message })
      }
}

//Controller Function to roll back to a previous version
export const rollbackVersion = async (req: Request, res: Response) => {
      try {
            const UserId = req.UserId;
            if (!UserId) {
                  return res.status(401).json({ message: "Unauthorized" })
            }

            const { projectId, versionId } = req.params;

            const project = await prisma.websiteProject.findUnique({
                  where: { id: projectId, userId: UserId },
                  include: { versions: true }
            })

            if (!project) {
                  return res.status(404).json({ message: "Project not found" })
            }

            const version = project.versions.find((version) => version.id === versionId)

            if (!version) {
                  return res.status(404).json({ message: "Version not found" })
            }

            await prisma.websiteProject.update({
                  where: { id: projectId },
                  data: {
                        current_code: version.code,
                        current_version_index: version.id
                  }
            })

            await prisma.conversation.create({
                  data: {
                        role: "assistant",
                        content: "I have rolled back your website to the selected version.",
                        projectId
                  }
            })

            res.json({ message: "Rolled back successfully" })
      }
      catch (error: any) {
            console.log(error.code || error.message);
            res.status(500).json({ message: error.message })
      }
}

//Delete any project
export const deleteProject = async (req: Request, res: Response) => {
      try {
            const UserId = req.UserId;
            const { projectId } = req.params;

            await prisma.websiteProject.delete({
                  where: { id: projectId, userId: UserId }
            })

            res.json({ message: "Project deleted successfully" });
      }
      catch (error: any) {
            console.log(error.code || error.message);
            res.status(500).json({ message: error.message })
      }
}

//Controller for getting project code for preview
export const getProjectPreview = async (req: Request, res: Response) => {
      try {
            const UserId = req.UserId;
            const { projectId } = req.params;

            if (!UserId) {
                  return res.status(401).json({ message: "Unauthorized" })
            }

            const project = await prisma.websiteProject.findFirst({
                  where: { id: projectId, userId: UserId },
                  include: { versions: true }
            })

            if (!project) {
                  return res.status(404).json({ message: "Project not found" })
            }
            res.json({ project });
      }
      catch (error: any) {
            console.log(error.code || error.message);
            res.status(500).json({ message: error.message })
      }
}

//GetPublished Projects
export const getPublishedProjects = async (req: Request, res: Response) => {
      try {
            const projects = await prisma.websiteProject.findMany({
                  where: { isPublished: true },
                  include: { user: true }
            })
            res.json({ projects });
      }
      catch (error: any) {
            console.log(error.code || error.message);
            res.status(500).json({ message: error.message })
      }
}

//Controller to a Get a singleproject bt id
export const getProjectById = async (req: Request, res: Response) => {
      try {
            const { projectId } = req.params;

            const project = await prisma.websiteProject.findFirst({
                  where: { id: projectId }
            })

            if (!project || project.isPublished === false || !project?.current_code) {
                  return res.status(404).json({ message: "Project not found" })
            }

            res.json({ code: project.current_code });
      }
      catch (error: any) {
            console.log(error.code || error.message);
            res.status(500).json({ message: error.message })
      }
}

//Controller to save changes in the project
export const saveProjectCode = async (req: Request, res: Response) => {
      try {
            const UserId = req.UserId;
            const { projectId } = req.params;
            const { code } = req.body;

            if (!UserId) {
                  return res.status(401).json({ message: "Unauthorized" })
            }

            if (!code) {
                  return res.status(400).json({ message: "Code is required" })
            }

            const project = await prisma.websiteProject.findFirst({
                  where: { id: projectId, userId: UserId },
                  include: { versions: true }
            })

            if (!project) {
                  return res.status(404).json({ message: "Project not found" })
            }

            await prisma.websiteProject.update({
                  where: { id: projectId },
                  data: {
                        current_code: code,
                        current_version_index: ""
                  }
            })

            res.json({ message: "Project saved successfully" });
      }
      catch (error: any) {
            console.log(error.code || error.message);
            res.status(500).json({ message: error.message })
      }
}