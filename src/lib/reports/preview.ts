// Report preview stub -- jspdf and handlebars are not installed.
// Install them when report preview functionality is needed.

import { format as formatDate } from 'date-fns';

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
  trends?: unknown;
  stock?: StockItem[];
}

export async function generatePreview(
  template: ReportTemplate,
  data: Data,
  format: string
): Promise<string | Buffer> {
  const generatedAt = formatDate(new Date(), 'PPpp');

  if (format === 'html') {
    let html = `<div class="report-preview"><h1>${template.name}</h1><p>Generated: ${generatedAt}</p>`;

    if (template.type === 'performance' && data.metrics) {
      html += '<div class="metrics">';
      for (const metric of data.metrics) {
        html += `<div class="metric"><h3>${metric.name}</h3><p>${metric.value}${metric.unit}</p></div>`;
      }
      html += '</div>';
    } else if (template.type === 'inventory' && data.stock) {
      html += '<div class="stock-summary">';
      for (const item of data.stock) {
        html += `<div class="stock-item"><h3>${item.item}</h3><p>Quantity: ${item.quantity}</p><p>Status: ${item.status}</p></div>`;
      }
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  // PDF stub -- return text buffer
  let text = `${template.name}\nPreview generated: ${generatedAt}\n\n`;

  if (template.type === 'performance' && data.metrics) {
    for (const metric of data.metrics) {
      text += `${metric.name}: ${metric.value}${metric.unit}\n`;
    }
  } else if (template.type === 'inventory' && data.stock) {
    for (const item of data.stock) {
      text += `${item.item}: ${item.quantity} (${item.status})\n`;
    }
  }

  return Buffer.from(text, 'utf-8');
}
