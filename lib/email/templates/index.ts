import Handlebars from 'handlebars';
import mjml2html from 'mjml';
import fs from 'fs/promises';
import path from 'path';

const templateCache = new Map<string, HandlebarsTemplateDelegate>();

export async function compileTemplate(
  templateName: string,
  data: any
): Promise<string> {
  let template = templateCache.get(templateName);

  if (!template) {
    const mjmlTemplate = await fs.readFile(
      path.join(process.cwd(), 'lib/email/templates', `${templateName}.mjml`),
      'utf-8'
    );

    const { html } = mjml2html(mjmlTemplate);
    template = Handlebars.compile(html);
    templateCache.set(templateName, template);
  }

  return template(data);
}