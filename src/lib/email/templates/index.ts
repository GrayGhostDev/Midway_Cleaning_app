// Email template compiler stub -- mjml and handlebars are not installed.
// Install mjml and handlebars when MJML email templates are needed.

const templateCache = new Map<string, (data: any) => string>();

export async function compileTemplate(
  templateName: string,
  data: any
): Promise<string> {
  let template = templateCache.get(templateName);

  if (!template) {
    // Without mjml/handlebars, return a basic HTML wrapper
    console.warn(`[EMAIL TEMPLATE STUB] Template "${templateName}" compiled as plain text (mjml not installed)`);
    template = (d: any) =>
      `<div>${Object.entries(d).map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`).join('')}</div>`;
    templateCache.set(templateName, template);
  }

  return template(data);
}
