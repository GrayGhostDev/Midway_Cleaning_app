import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import Handlebars from 'handlebars';

const previewTemplates = {
  performance: `
    <div class="report-preview">
      <h1>{{name}}</h1>
      <div class="metrics">
        {{#each data.metrics}}
        <div class="metric">
          <h3>{{name}}</h3>
          <p>{{value}}{{unit}}</p>
        </div>
        {{/each}}
      </div>
      {{#if data.trends}}
      <div class="trends">
        <h2>Trends</h2>
        <!-- Add trend visualization -->
      </div>
      {{/if}}
    </div>
  `,
  inventory: `
    <div class="report-preview">
      <h1>{{name}}</h1>
      <div class="stock-summary">
        {{#each data.stock}}
        <div class="stock-item">
          <h3>{{item}}</h3>
          <p>Quantity: {{quantity}}</p>
          <p>Status: {{status}}</p>
        </div>
        {{/each}}
      </div>
    </div>
  `,
};

export async function generatePreview(
  template: any,
  data: any,
  format: string
): Promise<string | Buffer> {
  const templateHtml = previewTemplates[template.type.toLowerCase()];
  
  if (!templateHtml) {
    throw new Error(`No preview template found for type: ${template.type}`);
  }

  const compiledTemplate = Handlebars.compile(templateHtml);
  const html = compiledTemplate({
    name: template.name,
    data,
    generatedAt: format(new Date(), 'PPpp'),
  });

  if (format === "html") {
    return html;
  }

  // Generate PDF preview
  const doc = new jsPDF();
  
  // Basic PDF styling
  doc.setFontSize(20);
  doc.text(template.name, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Preview generated: ${format(new Date(), 'PPpp')}`, 20, 30);
  
  // Add content based on template type
  let yPosition = 50;
  
  if (template.type === "PERFORMANCE") {
    data.metrics.forEach((metric: any) => {
      doc.text(`${metric.name}: ${metric.value}${metric.unit}`, 20, yPosition);
      yPosition += 10;
    });
  } else if (template.type === "INVENTORY") {
    data.stock.forEach((item: any) => {
      doc.text(`${item.item}: ${item.quantity} (${item.status})`, 20, yPosition);
      yPosition += 10;
    });
  }

  return Buffer.from(doc.output('arraybuffer'));
}