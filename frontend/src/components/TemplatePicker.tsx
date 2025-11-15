import { FileText, Layout } from 'lucide-react'

export type TemplateType = 'ClassicA' | 'ModernB'

interface TemplatePickerProps {
  selectedTemplate: TemplateType
  onTemplateChange: (template: TemplateType) => void
}

export default function TemplatePicker({ selectedTemplate, onTemplateChange }: TemplatePickerProps) {
  const templates: { type: TemplateType; name: string; description: string; icon: JSX.Element }[] = [
    {
      type: 'ClassicA',
      name: 'Classic',
      description: 'Traditional, clean layout',
      icon: <FileText size={24} />,
    },
    {
      type: 'ModernB',
      name: 'Modern',
      description: 'Contemporary, colorful design',
      icon: <Layout size={24} />,
    },
  ]

  return (
    <div className="mb-2">
      <label className="block text-xs font-medium text-gray-700 mb-1.5">Resume Template</label>
      <div className="flex gap-2">
        {templates.map((template) => (
          <button
            key={template.type}
            type="button"
            onClick={() => onTemplateChange(template.type)}
            className={`flex-1 p-2 border-2 rounded-lg transition-all ${
              selectedTemplate === template.type
                ? 'border-brand-primary bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-center mb-1 text-brand-primary">
              <div className="scale-75">{template.icon}</div>
            </div>
            <div className="font-semibold text-sm text-gray-900">{template.name}</div>
            <div className="text-xs text-gray-500 leading-tight">{template.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

