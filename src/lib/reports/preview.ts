import { jsPDF } from 'jspdf';
import { format as formatDate } from 'date-fns';
import Handlebars from 'handlebars';

type PreviewTemplateType = 'performance' | 'inventory';

interface ReportTemplate {
  type: PreviewTemplateType;
  name: string;
}

interface Metric {
  name: string;
  value: string;
  unit: string;
}

interface StockItem {
  item: string;
  quantity: string;
  status: string;
}

interface Data {
  metrics?: Metric[];
  trends?: any;
  stock?: StockItem[];
}

const previewTemplates: Record<PreviewTemplateType, string> = {
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
  template: ReportTemplate,
  data: Data,
  format: string
): Promise<string | Buffer> {
  const templateHtml = previewTemplates[template.type.toLowerCase() as PreviewTemplateType];
  
  if (!templateHtml) {
    throw new Error(`No preview template found for type: ${template.type}`);
  }

  const compiledTemplate = Handlebars.compile(templateHtml);
  const html = compiledTemplate({
    name: template.name,
    data,
    generatedAt: formatDate(new Date(), 'PPpp'),
  });

  if (format === "html") {
    return html;
  }

  // Generate PDF
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(template.name, 20, 20);
  
  doc.setFontSize(10);
  doc.text(`Preview generated: ${formatDate(new Date(), 'PPpp')}`, 20, 30);
  
  // Add content based on template type
  let yPosition = 50;
  
  if (template.type === "performance") {
    data.metrics?.forEach((metric: Metric) => {
      doc.text(`${metric.name}: ${metric.value}${metric.unit}`, 20, yPosition);
      yPosition += 10;
    });
  } else if (template.type === "inventory") {
    data.stock?.forEach((item: StockItem) => {
      doc.text(`${item.item}: ${item.quantity} (${item.status})`, 20, yPosition);
      yPosition += 10;
    });
  }

  return Buffer.from(doc.output('arraybuffer'));
}