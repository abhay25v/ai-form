"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { saveForm } from "./mutateForm";

export async function generateForm(
  prevState: { message: string },
  formData: FormData
) {
  const schema = z.object({
    description: z.string().min(1, "Description is required"),
  });

  const parsedData = schema.safeParse({
    description: formData.get("description"),
  });

  if (!parsedData.success) {
    console.log(parsedData.error);
    return {
      message: parsedData.error.errors[0].message,
    };
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return {
      message: "OpenRouter API key is not set",
    };
  }

  const data = parsedData.data;
  const configuredModel = process.env.OPENROUTER_MODEL?.trim();
  const modelCandidates = [
    configuredModel,
    "qwen/qwen-2.5-72b-instruct:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "openai/gpt-4o-mini",
  ].filter((model, index, list): model is string => {
    if (!model) {
      return false;
    }

    return list.indexOf(model) === index;
  });

  const promptExplanation =
    "Based on the description, generate a survey object with 3 fields: name(string) for the form, description(string) of the form and a questions array where every element has 2 fields: text and the fieldType and fieldType can be of these options RadioGroup, Select, Input, Textarea, Switch; and return it in json format. For RadioGroup, and Select types also return fieldOptions array with text and value fields. For example, for RadioGroup, and Select types, the field options array can be [{text: 'Yes', value: 'yes'}, {text: 'No', value: 'no'}] and for Input, Textarea, and Switch types, the field options array can be empty. For example, for Input, Textarea, and Switch types, the field options array can be []";
  //     const promptExplanation = `
  // Based on the following description, generate a JSON object for a survey form with this structure:

  // {
  //   "name": string,
  //   "description": string,
  //   "questions": [
  //     {
  //       "text": string,
  //       "fieldType": "RadioGroup" | "Select" | "Input" | "Textarea" | "Switch",
  //       "fieldOptions": [
  //         { "text": string, "value": string }
  //       ]
  //     }
  //   ]
  // }

  // Rules:
  // - Only use the fieldType values listed above.
  // - For "RadioGroup" and "Select", provide at least two fieldOptions.
  // - For "Input", "Textarea", and "Switch", fieldOptions must be an empty array.
  // - Return only valid JSON, no explanations or extra text.

  // Description: ${data.description}
  // `;
  try {
    let content: string | null = null;
    let lastApiMessage = "";

    for (const model of modelCandidates) {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: `${data.description} ${promptExplanation}`,
            },
          ],
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        const apiMessage =
          json?.error?.message ||
          `OpenRouter request failed with status ${response.status}`;

        if (response.status === 401 || response.status === 403) {
          return {
            message:
              "OpenRouter authentication failed. Check your API key and account access.",
          };
        }

        if (response.status === 429) {
          return {
            message:
              "OpenRouter rate limit reached. Please wait a bit and try again.",
          };
        }

        const noEndpoints =
          typeof apiMessage === "string" &&
          apiMessage.toLowerCase().includes("no endpoints found");

        if (noEndpoints) {
          lastApiMessage = `${model}: ${apiMessage}`;
          continue;
        }

        return {
          message: apiMessage,
        };
      }

      const modelContent = json?.choices?.[0]?.message?.content;
      if (!modelContent || typeof modelContent !== "string") {
        lastApiMessage = `${model}: OpenRouter returned an unexpected response.`;
        continue;
      }

      content = modelContent;
      break;
    }

    if (!content) {
      return {
        message:
          lastApiMessage ||
          "No available AI model endpoints. This is usually a model/tier issue (not an API key issue). Set OPENROUTER_MODEL in .env to an active model from your OpenRouter account, or add credits for non-free models.",
      };
    }

    // Extract the first JSON object from the response, even if there's extra text
    const extractFirstJson = (str: string) => {
      const match = str.match(/{[\s\S]*}/);
      return match ? match[0] : null;
    };

    const cleaned = extractFirstJson(content);

    let parsedForm;
    try {
      if (!cleaned) throw new Error("No JSON object found in AI response.");
      parsedForm = JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse form JSON:", cleaned, e);
      return {
        message: "AI response was not valid JSON. Please try again.",
      };
    }

    const dbFormId = await saveForm({
      name: parsedForm.name || "Generated Form",
      description: parsedForm.description || "AI Generated Form",
      questions: parsedForm.questions || [],
    });

    revalidatePath("/");
    return {
      message: "success",
      data: { formId: dbFormId },
    };
  } catch (error) {
    if (error instanceof Error && error.message === "GUEST_TRIAL_LIMIT_REACHED") {
      return {
        message: "You already used your free guest trial. Sign in to create more forms.",
        requiresAuth: true,
      };
    }

    console.error("Error generating form:", error);
    return {
      message: "Failed to generate form. Please try again later.",
    };
  }
}